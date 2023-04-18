/**
 * handles task operations. this includes interacting with the database. initialize database before creating or using
 */

const DatabaseHandler = require("./databaseHandler");
const helpers = require("../lib/helpers");
const UserHandler = require("./userHandler");
const Query = require("./database/query");
const Statement = require("./database/statement");
const { epochToMMDDYYY, isHourMinuteBefore } = require("../lib/helpers");

module.exports = class taskHandler {

    static current;

    constructor() {
        taskHandler.current = this;
    }


    /**
     * generates an unused id for a task
     * @return unused id for a task
     */
    async _getNewTaskId() {
        const taskIds = await this.getAllTaskIds();
        var currentId = 0;
        for (var i = 0; i < taskIds.length; i++) {
            //go through all ids, incrementing the current id. when they do not match we have an unused id
            if (currentId != taskIds[i]) {
                break;
            }
            currentId++;
        }

        return currentId;
    }


    async _getAllTasks(username) {
        var q = new Query(1, "SELECT * FROM tasks WHERE username = ?", [username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        return DatabaseHandler.current.waitForOperationToFinish(id);
    }


    /**
     * generates an unused recursive id for a task
     * @return unused recursive id
     */
    async _getNewRecursiveTaskId(username) {
        const taskIds = await this.getAllRecursiveTaskIds(username);
        var currentRecursiveId = 0;
        for (var i = 0; i < taskIds.length; i++) {
            //go through all ids, incrementing the current id. when they do not match we have an unused id
            if (currentRecursiveId != taskIds[i]) {
                break;
            }
            currentRecursiveId++;
        }

        return currentRecursiveId;
    }


    async getAllRecursiveTaskIds(username) {
        var oppId = DatabaseHandler.current.enqueueOperation(new Query(1, "SELECT DISTINCT recursiveId FROM tasks WHERE username=? ORDER BY recursiveId", [username]));
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //convert from objects to a list of ints
        var idLs = [];
        for (var i = 0; i < result.length; i++) {
            idLs.push(result[i].recursiveId);
        }

        return idLs;
    }


    async getRecursiveTasksById(username, id) {
        var q = new Query(1, "SELECT DISTINCT * FROM tasks WHERE username =? AND recursiveId = ?", [username, id]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);

        return result;
    }

    async getRecursiveRatedTasksById(username, id) {

        var q = new Query(1, "SELECT DISTINCT * FROM  (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE username =? AND recursiveId = ?", [username, id]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);

        return result;
    }


    /**
     * finds all tasks in the database which share a recursive id
     * @param {*} recursiveId recursve id of the linked tasks
     * @return a list of tasks
     */
    async getAllLinkedTasks(recursiveId) {
        var oppId = DatabaseHandler.current.enqueueOperation(new Query(1, "SELECT * FROM tasks ORDER BY taskId WHERE recursiveId = ?", [recursiveId]));
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        return result;
    }

    /**
     * @return a list of all task ids in the database
     */
    async getAllTaskIds() {
        var oppId = DatabaseHandler.current.enqueueOperation(new Query(1, "SELECT taskId FROM tasks ORDER BY taskId", []));
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //convert from objects to a list of ints
        var idLs = [];
        for (var i = 0; i < result.length; i++) {
            idLs.push(result[i].taskId);
        }

        return idLs;
    }


    /**
     * adds a single task to the database. do not used for recursive tasks. 
     * @param {*} username username of who the task belongs to
     * @param {*} summary a summary of the task
     * @param {*} date date of the task in the string format mm/dd/yyyy
     * @param {*} startTime start time of the task in the string format hh:mm
     * @param {*} endTime end time of the task in the string format hh:mm
     */
    async addTask(username, summary, date, location, startTime, endTime, priority) {
        if (!await this._areTaskParametersValid(username, summary, date, location, startTime, endTime)) {
            return -1;
        }

        if (await this._similarTaskExist(username, summary, date, location, startTime, endTime)) {
            //dont add to calendar as conflict exists
            return -1;
        }

        //find all tasks which share the same summary and link them with a recursive id
        var query = new Query(priority, "SELECT * FROM tasks WHERE username = ? AND summary = ?", [username, summary]); ``
        var oppId = DatabaseHandler.current.enqueueOperation(query);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);


        var recursiveId = -1;
        if (result.length == 1) {
            //give both tasks a new recursive id
            var newRId = await this._getNewRecursiveTaskId(username);

            //update the existing task
            var updateStatement = new Statement(1, "UPDATE tasks SET recursiveId = ? WHERE taskId = ?", [newRId, result[0].taskId])
            var updateOppId = DatabaseHandler.current.enqueueOperation(updateStatement);
            await DatabaseHandler.current.waitForOperationToFinish(updateOppId);
            recursiveId = newRId;
        }
        else if (result.length > 1) {
            //give current task the same recursive id
            recursiveId = result[0].recursiveId;
        }


        //everything is valid, add to database
        var taskId = await this._getNewTaskId();
        var statement = new Statement(priority, "INSERT INTO tasks (taskId, username, summary, location, date, startTime, endTime, recursiveId) VALUES(?,?,?,?,?,?,?,?)", [taskId, username, summary, location, date, startTime, endTime, recursiveId]);
        DatabaseHandler.current.enqueueOperation(statement);
        //await DatabaseHandler.current.exec("INSERT INTO tasks (taskId, username, summary, location, date, startTime, endTime, recursiveId) VALUES(?,?,?,?,?,?,?,-1)", [taskId, username, summary, location, date, startTime, endTime]);


        return;

    }


    /**
     * checks a task that exists with the given parameters. used to check if a task is already in the database before creating one with a separate id.
     * @param {*} username 
     * @param {*} summary 
     * @param {*} date 
     * @param {*} location 
     * @param {*} startTime 
     * @param {*} endTime 
     * @returns true if a task with similar parameters exists.
     */
    async _similarTaskExist(username, summary, date, location, startTime, endTime) {
        var q = new Query(1, "SELECT * FROM tasks WHERE username = ? AND summary = ? AND date = ? AND location = ? AND startTime = ? AND endTime = ?", [username, summary, date, location, startTime, endTime]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var result = await DatabaseHandler.current.query("SELECT * FROM tasks WHERE username = ? AND summary = ? AND date = ? AND location = ? AND startTime = ? AND endTime = ?", [username, summary, date, location, startTime, endTime]);
        return result.length > 0;
    }


    async parseAndImportGoogleEvents(events, username) {
        console.log("[TaskHandler] Importing google events from user \"" + username + "\"");
        for (var i = 0; i < events.length; i++) {
            const event = events[i];
            var summary = event.summary;

            if (!event.start.dateTime) {
                continue; //skip the event

            }

            var parsedStartDate = new Date(Date.parse(event.start.dateTime));


            var date = parsedStartDate.toISOString().split('T')[0];

            //date is given in yyyy-mm-dd. reformat to mm/dd/yyyy
            var dateParts = date.split("-");
            date = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];


            var startTime = helpers.verifyHourMinuteTimeFormat(parsedStartDate.getHours() + ":" + parsedStartDate.getMinutes());
            var parsedEndDate = new Date(Date.parse(event.end.dateTime));


            if (!helpers.datesAreOnSameDay(parsedStartDate, parsedEndDate)) {
                continue; //ignore multi day events
            }

            if (!event.end.dateTime) {
                continue; //skip the event

            }
            var endTime = helpers.verifyHourMinuteTimeFormat(parsedEndDate.getHours() + ":" + parsedEndDate.getMinutes());
            var location = "none";
            await this.addTask(username, summary, date, location, startTime, endTime, 5);
        }
    }

    async parseAndImportOutlookEvents(events, username) {
        console.log("[TaskHandler] Importing outlook events from user \"" + username + "\"");
        for (var i = 0; i < events.length; i++) {
            const event = events[i];
            var summary = event.subject;
            var parsedStartDate = new Date(Date.parse(event.start.dateTime + "Z"));//z on the end parses as utc time
            var date = parsedStartDate.toISOString().split('T')[0];


            //date is given in yyyy-mm-dd. reformat to mm/dd/yyyy
            var dateParts = date.split("-");
            date = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];

            var startTime = helpers.verifyHourMinuteTimeFormat(parsedStartDate.getHours() + ":" + parsedStartDate.getMinutes());
            var parsedEndDate = new Date(Date.parse(event.end.dateTime + "Z"));

            if (!helpers.datesAreOnSameDay(parsedStartDate, parsedEndDate)) {
                continue; //ignore multi day events
            }

            var endTime = helpers.verifyHourMinuteTimeFormat(parsedEndDate.getHours() + ":" + parsedEndDate.getMinutes());
            var location = "none";
            await this.addTask(username, summary, date, location, startTime, endTime, 5);
        }

    }


    /**
     * 
     * @param {*} username username of the user
     * @param {*} day day of the dasks in mm/dd/yyyy format
     * @returns a days tasks for a given user
     */
    async getDaysTasks(username, day) {
        var query = new Query(1, "SELECT * FROM tasks WHERE date = ? AND username = ?", [day, username]);
        var id = DatabaseHandler.current.enqueueOperation(query);


        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        //var result = await DatabaseHandler.current.query("SELECT * FROM tasks WHERE date = ? AND username = ?", [day, username]);

        return result;
    }


    /**
     * returns all active tasks for a given data. a.k.a tasks that have not been finished yet
     * @param {*} username username which the tasks belong to
     * @param {*} date date to get tasks from
     * @param {*} time current user time. hh:mm
     */
    async getTodaysActiveTasks(username, date, time) {
        var todaysTasks = await this.getDaysTasks(username, date);
        var activeTasks = [];

        //go through all tasks and add the ones that are after the given time to the active tasks list
        for (var i = 0; i < todaysTasks.length; i++) {
            if (helpers.isHourMinuteBefore(time, todaysTasks[i].endTime)) {
                activeTasks.push(todaysTasks[i]);
            }
        }



        return activeTasks;

    }

    /**
    * returns all finished tasks for a given data
    * @param {*} username username which the tasks belong to
    * @param {*} date date to get tasks from
    * @param {*} time current user time. hh:mm
    */
    async getTodaysFinishedTasks(username, date, time) {
        var todaysTasks = await this.getDaysTasks(username, date);
        var finishedTasks = [];

        //go through all tasks and add the ones that are after the given time to the active tasks list
        for (var i = 0; i < todaysTasks.length; i++) {
            if (!helpers.isHourMinuteBefore(time, todaysTasks[i].endTime)) {
                finishedTasks.push(todaysTasks[i]);
            }
        }

        return finishedTasks;

    }


    /**
     * returns a task based on the id
     * @param {*} id 
     */
    async getTask(id) {
        var q = new Query(1, "SELECT * FROM tasks WHERE taskId = ?", [id]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var result = await DatabaseHandler.current.query("SELECT * FROM tasks WHERE taskId = ?", [id]);
        if (result) {
            return result[0];
        }
        return null; //no task found with the id
    }

    async getUserTask(username, id) {
        var q = new Query(1, "SELECT * FROM tasks WHERE taskId = ? && username = ?", [id, username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var result = await DatabaseHandler.current.query("SELECT * FROM tasks WHERE taskId = ? && username = ?", [id, username]);
        if (result) {
            return result[0];
        }
        return null; //no task found with the id
    }


    /**
     * 
     * @param {*} id 
     * @returns true if a task exists in the database
     */
    async taskExists(id) {
        return this.getTask(id) != null;
    }


    /**
     * updates a task with the given task id in the database
     * @param {*} id 
     * @param {*} username 
     * @param {*} summary 
     * @param {*} date 
     * @param {*} location 
     * @param {*} startTime 
     * @param {*} endTime 
     * @returns true if succesful
     */
    async updateTask(id, username, summary, date, location, startTime, endTime) {

        //check if task is in database
        if (!await this.taskExists(id)) {
            return false;
        }

        if (!await this._areTaskParametersValid(username, summary, date, location, startTime, endTime)) {
            return false;
        }



        //perform update to database
        var statement = new Statement(1, "UPDATE tasks SET username = ?, summary = ?, location =?, date=?, startTime =?, endTime =? WHERE taskId =?", [username, summary, location, date, startTime, endTime, id]);
        DatabaseHandler.current.enqueueOperation(statement);
        //DatabaseHandler.current.exec("UPDATE tasks SET username = ?, summary = ?, location =?, date=?, startTime =?, endTime =?, recursiveId = ? WHERE taskId =?", [username, summary, location, date, startTime, endTime, rescursiveId, id]);

        return true;
    }


    /**
     * checks if the parameters given are correct to add/update a task
     * @param {*} username 
     * @param {*} summary 
     * @param {*} date 
     * @param {*} location 
     * @param {*} startTime 
     * @param {*} endTime 
     */
    async _areTaskParametersValid(username, summary, date, location, startTime, endTime) {
        //verify that user exists. check date, endtime and starttime are all in the correct format. 
        return (await UserHandler.current.userExists(username)) && helpers.isDateFormat(date) && helpers.isTimeFormat(startTime) && helpers.isTimeFormat(endTime) && location && summary;
    }


    /**
     * deletes a task in the database
     * @param {*} id id of the task to delete
     */
    async deleteTask(id) {
        var s = new Statement(2, "DELETE FROM tasks WHERE taskId = ?", [id]);
        DatabaseHandler.current.enqueueOperation(s);
    }

    /**
     * @param id id of the task
     * @returns the rated task object or null if task is not completed
     */
    async getRatedTask(id) {
        var q = new Query(1, "SELECT * FROM ratedTasks WHERE taskId = ?", [id]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var result = await DatabaseHandler.current.query("SELECT * FROM ratedTasks WHERE taskId = ?", [id]);
        if (result) {
            return result[0];
        }
        return null; //no task found with the id
    }


    /**
     * 
     * @param {*} id id of the task
     * @returns if the task has been completed in the database
     */
    async isTaskRated(id) {
        return await this.getRatedTask(id) != null;
    }

    /**
     * completes a task in the database
     * @param {*} id id of the task to completed. must be a pre-existing task
     * @param {*} enjoyment enjoyment of the task from 1-5. 5 being the most
     * @param {*} physicalActivity phyiscal activity of the task from 1-5. 5 being the most
     * @param {*} engagement was the user engaged? from 1-5. 5 being the most
     * @param {*} mentalDifficulty mental difficult of the task from 1-5. 5 being the
     * @returns true if successful. false if not
     */
    async rateTask(id, enjoyment, physicalActivity, engagement, mentalDifficulty) {

        //check that task exists and is not completed
        if ((!await this.taskExists(id)) || await this.isTaskRated(id)) {
            return false;
        }

        //insert into database
        var statement = new Statement(2, "INSERT INTO ratedTasks (taskId, enjoyment, phyiscalActivity, engagement, mentalDifficulty) VALUES(?,?,?,?,?)", [id, enjoyment, physicalActivity, engagement, mentalDifficulty]);
        DatabaseHandler.current.enqueueOperation(statement);
        //await DatabaseHandler.current.exec("INSERT INTO ratedTasks (taskId, enjoyment, phyiscalActivity, engagement, mentalDifficulty) VALUES(?,?,?,?,?)", [id, enjoyment, physicalActivity, engagement, mentalDifficulty]);



        return true;



    }



    /**
     * gets all the tasks within a month for a specific user
     * @param {*} month month to get tasks from in the format mm/yyyy
     * @param {*} username 
     * @returns a list of {day, taskId}
     */
    async getMonthsTasks(month, username) {
        //verify the user exists
        if (!await UserHandler.current.userExists(username)) {
            return [];
        }

        //verify month is in the correct format
        if (month.length != 7 || month.substring(2, 3) != "/") {
            return [];
        }

        var monthNum = month.substring(0, 2);
        var yearNum = month.substring(3, 7);
        var glob = monthNum + "/??/" + yearNum;
        var q = new Query(1, "SELECT taskId, date FROM tasks WHERE date GLOB ? AND username = ?", [glob, username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var tasks = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var tasks = await DatabaseHandler.current.query("SELECT taskId, date FROM tasks WHERE date GLOB ? AND username = ?", [glob, username]);
        return tasks;
    }


    /**
    * gets all the rated tasks within a month for a specific user
    * @param {*} month month to get tasks from in the format mm/yyyy
    * @param {*} username 
    * @returns a list of {day, taskId}
    */
    async getMonthsRatedTasks(month, username) {
        //verify the user exists
        if (!await UserHandler.current.userExists(username)) {
            return [];
        }

        //verify month is in the correct format
        if (month.length != 7 || month.substring(2, 3) != "/") {
            return [];
        }

        var monthNum = month.substring(0, 2);
        var yearNum = month.substring(3, 7);
        var glob = monthNum + "/??/" + yearNum;
        var q = new Query(1, "SELECT DISTINCT ratedTasks.taskId, date FROM (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE  username = ? AND date GLOB ?", [username, glob]);
        //var q = new Query(1, "SELECT DISTINCT taskId, date FROM ratedTasks WHERE date GLOB ? AND username = ?", [glob, username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var tasks = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var tasks = await DatabaseHandler.current.query("SELECT taskId, date FROM ratedTasks WHERE date GLOB ? AND username = ?", [glob, username]);
        return tasks;
    }


    /**
     * 
     * @param {*} username the username which the tasks belong
     * @returns a list of all a user's unrated, completed tasks
     */
    async getUnratedCompletedTasks(username, epoch) {
        if (!await UserHandler.current.userExists(username)) {
            return [];
        }

        var hhmm = helpers.epochToHHMM(epoch);
        hhmm = helpers.verifyHourMinuteTimeFormat(hhmm);
        var date = epochToMMDDYYY(epoch);
        var mm = date.substring(0, 2) + "/??/" + date.substring(6, 10);;
        var year = "??/??/" + date.substring(6, 10);

        var q = new Query(1, "SELECT DISTINCT * FROM tasks WHERE username=? AND taskId NOT IN (SELECT taskId FROM ratedTasks)", [username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var tasks = await DatabaseHandler.current.waitForOperationToFinish(oppId);



        var tasksOut = [];
        for (var i = 0; i < tasks.length; i++) {

            var taskDate = tasks[i].date;
            if (taskDate && helpers.MMDDYYYYbeforeMMDDYYYY(taskDate, date)) {
                if (date == taskDate) {
                    if (isHourMinuteBefore(tasks[i].endTime, hhmm)) {
                        tasksOut.push(tasks[i]);
                    }
                }
                else {
                    tasksOut.push(tasks[i]);
                }


            }
        }






        //var tasks = await DatabaseHandler.current.query("SELECT taskId, date FROM tasks WHERE username=? AND taskId NOT IN (SELECT taskId FROM ratedTasks)", [username]);
        return tasksOut;

    }

    /**
     * 
     * @param {*} username 
     * @param {*} engagement 
     * @returns a list of a user's rated tasks {taskId, date} with the given engagement vaulue 
     */
    async getRatedByEngagement(username, engagement) {
        if (!await UserHandler.current.userExists(username)) {
            return [];
        }

        var q = new Query(1, "SELECT taskId, date FROM tasks WHERE username=? AND taskId IN (SELECT taskId from ratesTasks WHERE engagement =?)", [username, engagement]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var tasks = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var tasks = await DatabaseHandler.current.query("SELECT taskId, date FROM tasks WHERE username=? AND taskId IN (SELECT taskId from ratesTasks WHERE engagement =?)",[username, engagement]);
        return tasks;

    }



    /**
     * 
     * @param {*} username 
     * @returns the total number of completed tasks belonging to a user
     */
    async totalCompletedTasks(username, epoch) {
        var tasks = await this._getAllTasks(username);
        var count = 0;
        var now = new Date();

        tasks.forEach(task => {
            var taskDate = helpers.MMDDYYYYAndHHMMtoDate(task.date, task.endTime);
            if (taskDate <= now) {
                count++;
            }
        });

        return count;
    }


    async totalRatedTasks(username) {
        var q = new Query(1, "SELECT DISTINCT COUNT(*) as c FROM tasks WHERE username=? AND taskId IN (SELECT taskId FROM ratedTasks)", [username])
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        return result[0].c;
    }


    /**
     * 
     * @param {*} username 
     * @returns a list of all dates with a task for a user
     */
    async datesWithTask(username) {


        var q = new Query(1, "SELECT DISTINCT date FROM tasks WHERE username =?", [username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        return result;
    }


    /**
     * 
     * @param {*} username 
     * @returns the users least enjoyable, repetitive task
     */
    async leastEnjoyableRepetetiveTask(username) {
        var q = new Query(1, "SELECT DISTINCT summary, recursiveId, COUNT(*) as c FROM (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE username = ? AND enjoyment IN (SELECT min(enjoyment) FROM (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE username=?) GROUP BY recursiveId ORDER BY count(recursiveId) DESC", [username, username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        if (result.length == 0) {
            return null;
        }
        return result[0];
    }





    /**
     * 
     * @param {*} username 
     * @returns a task where which is first when the user's day is happiest
     */
    async happiestWhenDayStartsWith(username) {
        var q = new Query(1, "SELECT * FROM (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE date IN (SELECT date FROM daily WHERE happiness IN (SELECT max(happiness) FROM daily WHERE username = ?) AND username =?) ", [username, username])
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);

        if (result.length == 0) {
            return null;
        }

        var earliestRecIds = {};


        //find the task id and recursive id of the earliest of each date
        for (var i = 0; i < result.length; i++) {
            if (earliestRecIds[result[i].date] == null) {
                earliestRecIds[result[i].date] = [result[i].taskId, result[i].recursiveId, result[i].startTime];
            }
            else {
                var prev = earliestRecIds[result[i].date];
                if (helpers.isHourMinuteBefore(result[i].startTime, prev[2])) {
                    earliestRecIds[result[i].date] = [result[i].taskId, result[i].recursiveId, result[i].startTime];
                }
            }
        }

        var keys = Object.keys(earliestRecIds);
        var totals = {};

        //keep track of the count of total recursiveIds
        for (var i = 0; i < keys.length; i++) {
            var task = earliestRecIds[keys[i]];
            if (totals[task[1]] == null) {
                totals[task[1]] = 1;
            }
            else {
                totals[task[1]] = totals[task[1]] + 1;
            }
        }

        //get the biggest total
        var biggest = -1;
        var biggestRecurId = -2;
        keys = Object.keys(totals);
        for (var i = 0; i < keys.length; i++) {
            if (totals[keys[i]] > biggest) {
                biggest = totals[keys[i]]
                biggestRecurId = keys[i]
            }
        }

        if (biggestRecurId == -2) {
            return null;
        }

        if (biggestRecurId == -1) {
            //find the first take in the rec ids with a -1 id
            keys = Object.keys(earliestRecIds);
            for (var i = 0; i < keys.length; i++) {
                var recResult = earliestRecIds[keys[i]];
                if (recResult[1] == -1) {
                    var task = await this.getTask(recResult[0]);
                    return task;
                }
            }
        }

        //get tasks by the recursive id and return the first one
        var recursiveGroup = await this.getRecursiveRatedTasksById(username, biggestRecurId);
        if (recursiveGroup.length == 0) {
            return null;
        }

        recursiveGroup[0].c = recursiveGroup.length;
        return recursiveGroup[0];




    }


    /**
     * 
     * @param {*} username 
     * @returns a list of task id for all rated tasks belonging to the given user
     */
    async getAllRatedTasks(username) {
        var q = new Query(1, "SELECT * FROM  (ratedTasks INNER JOIN tasks ON ratedTasks.taskId = tasks.taskId) WHERE username = ?", [username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        return result;
    }



    /**
     * 
     * @param {*} username
     * @returns the next task that has not been completed for a user based on end time 
     */
    async nextTask(username, epochTime) {
        var tasks = await this._getAllTasks(username, time);

        var nowDate = helpers.MMDDYYYYtoDate(helpers.epochToMMDDYYY(epochTime));
        var nowHHMM = helpers.epochToHHMM(epochTime);



        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var taskDate = helpers.MMDDYYYYtoDate(task.date);
            if (helpers.datesAreOnSameDay(taskDate, nowDate)) {
                //check if task has already happened
                if (helpers.isHourMinuteBefore(nowHHMM, task.endTime)) {
                    return task;
                }
            }
            else if (helpers.MMDDYYYYbeforeMMDDYYYY(nowDate, taskDate)) {
                //date has to have not happened yet
                return task;
            }

        }

        return null; //all tasks have passed


    }



    /**
     * 
     * @param {*} username 
     * @param {*} taskId 
     * @returns true if the task belongs to user or false if not
     */
    async _taskBelongsToUser(username, taskId){
        var q = new Query(1, "SELECT * FROM tasks WHERE taskId =? AND username = ?", [taskId, username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        return result.length != 0;

    }


    /**
     * 
     * @param {*} taskId 
     * @param {*} category 
     * @returns true if the task belong to the category
     */
    async taskHasCategory(taskId, category){
        var q = new Query(1, "SELECT * FROM taskCategories WHERE taskId =? AND category = ?", [taskId, category]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        return result.length != 0;

    }


    /**
     * 
     * @param {*} taskId 
     * @param {*} username 
     * @returns a list of categories belonging to the task
     */
    async getTaskCategories(taskId, username){
        if(!await this.taskExists(taskId) || !await this._taskBelongsToUser(username, taskId)){
            return [];
        }
 
        var q = new Query(1, "SELECT category FROM taskCategories WHERE taskId = ?", [taskId]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);


        var cats = [];
        for(var i = 0; i<result.length; i++){
            cats.push(result[i].category);
        }

        return cats;
    }



    
    /**
     * adds a task to a specific category
     * @param {*} username 
     * @param {*} taskId 
     * @param {*} category 
     */
    async addTaskToCategory(username,taskId, category){
        //make sure task exists and belongs to the user
        if(!await this.taskExists(taskId) || !await this._taskBelongsToUser(username, taskId) || await this.taskHasCategory(taskId, category)){
            return false;
        }

        //insert task into db
        var ins = new Statement(1, "INSERT INTO taskCategories (taskId, category) VALUES(?,?)", [taskId, category]);
        DatabaseHandler.current.enqueueOperation(ins);
        return true;
    }



    /**
     * 
     * @param {*} username 
     * @returns all categories for which a user has tasks belonging to
     */
    async getAllUserTaskCategories(username){
        var q = new Query(1, "SELECT DISTINCT category FROM (taskCategories INNER JOIN tasks ON taskCategories.taskId = tasks.taskId) WHERE username = ?", [username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);


        var cats = [];
        for(var i = 0; i<result.length; i++){
            cats.push(result[i].category);
        }

        return cats;

    }

    /**
     * 
     * @param {*} username 
     * @returns a list of taskIds belonging to a category and a user
     */
    async getAllTasksBelongingToCategory(username, category){
        var q = new Query(1, "SELECT DISTINCT taskId FROM (taskCategories INNER JOIN tasks ON taskCategories.taskId = tasks.taskId) WHERE username = ? AND category = ?", [username, category]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);


        var tasks = [];
        for(var i = 0; i<result.length; i++){
            tasks.push(result[i].taskId);
        }

        return tasks;
    }
}


