/**
 * handles task operations. this includes interacting with the database. initialize database before creating or using
 */

const DatabaseHandler = require("./databaseHandler");
const helpers = require("../lib/helpers");
const Server = require("../server");

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


    /**
     * @return a list of all task ids in the database
     */
    async getAllTaskIds() {
        var result = await DatabaseHandler.current.query("SELECT taskId FROM tasks ORDER BY taskId");

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
     * @return the new id of the task or -1 if it wasn't added
     */
    async addTask(username, summary, date, location, startTime, endTime) {
        if (!await this._areTaskParametersValid(username, summary, date, location, startTime, endTime)) {
            return -1;
        }


        //everything is valid, add to database
        var taskId = await this._getNewTaskId();
        await DatabaseHandler.current.exec("INSERT INTO tasks (taskId, username, summary, location, date, startTime, endTime, recursiveId) VALUES(?,?,?,?,?,?,?,-1)", [taskId, username, summary, location, date, startTime, endTime]);


        return taskId;

    }


    async parseAndImportGoogleEvents(events, username) {
        for (var i = 0; i < events.length; i++) {
            const event = events[i];
            var summary = event.summary;
            var parsedStartDate = new Date(Date.parse(event.start.dateTime));
            var date = parsedStartDate.toISOString().split('T')[0];

            //date is given in yyyy-mm-dd. reformat to mm/dd/yyyy
            var dateParts = date.split("-");
            date = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0];


            var startTime = helpers.verifyHourMinuteTimeFormat(parsedStartDate.getHours() + ":" + parsedStartDate.getMinutes());
            var parsedEndDate = new Date(Date.parse(event.end.dateTime));

            if (!helpers.datesAreOnSameDay(parsedStartDate, parsedEndDate)) {
                continue; //ignore multi day events
            }

            var endTime = helpers.verifyHourMinuteTimeFormat(parsedEndDate.getHours() + ":" + parsedEndDate.getMinutes());
            var location = "none";
            await this.addTask(username, summary, date, location, startTime, endTime);
        }
    }

    async parseAndImportOutlookEvents(events, username) {
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
            await this.addTask(username, summary, date, location, startTime, endTime);
        }

    }


    /**
     * 
     * @param {*} username username of the user
     * @param {*} day day of the dasks in mm/dd/yyyy format
     * @returns a days tasks for a given user
     */
    async getDaysTasks(username, day) {
        var result = await DatabaseHandler.current.query("SELECT * FROM tasks WHERE date = ? AND username = ?", [day, username]);

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
        var result = DatabaseHandler.current.query("SELECT * FROM tasks WHERE id = ?", [id]);
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

        var rescursiveId = -1;

        //perform update to database
        DatabaseHandler.current.exec("UPDATE tasks SET username = ?, summary = ?, location =?, date=?, startTime =?, endTime =?, recursiveId = ? WHERE id =?", [username, summary, location, date, startTime,endTime, rescursiveId, id]);

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
        return (await Server.current.getUserHandler().userExists(username)) && helpers.isDateFormat(date) && helpers.isTimeFormat(startTime) && helpers.isTimeFormat(endTime) && location && summary ;
    }
}


