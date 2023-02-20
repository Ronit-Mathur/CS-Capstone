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
    async addTask(username, summary, date, startTime, endTime) {
        //verify that user exists
        if (!(await Server.current.getUserHandler().userExists(username))) {
            throw new Error("Unable to add task to database. User \"" + username + "\" does not exist.");

        }

        //verify times and date are in the correct format
        if (!helpers.isDateFormat(date)) {
            throw new Error("Unable to add task to database. Date string is invalid");
        }

        if (!helpers.isTimeFormat(startTime)) {
            throw new Error("Unable to add task to database. Start time string is invalid");
        }

        if (!helpers.isTimeFormat(endTime)) {
            throw new Error("Unable to add task to database. End time string is invalid");
        }


        //everything is valid, add to database
        var taskId = await this._getNewTaskId();
        await DatabaseHandler.current.exec("INSERT INTO tasks (taskId, username, summary, date, startTime, endTime, recursiveId) VALUES(?,?,?,?,?,?,-1)", [taskId, username, summary, date, startTime, endTime]);


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
            await this.addTask(username, summary, date, startTime, endTime);
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
            await this.addTask(username, summary, date, startTime, endTime);
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
}


