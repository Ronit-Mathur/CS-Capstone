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




}


