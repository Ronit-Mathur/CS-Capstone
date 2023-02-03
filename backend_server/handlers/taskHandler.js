/**
 * handles task operations. this includes interacting with the database. initialize database before creating or using
 */

const DatabaseHandler = require("./databaseHandler");
const UserHandler = require("./userHandler");
const helpers = require("../lib/helpers");

module.exports = class taskHandler {
    constructor() {

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
        return result;
    }


    /**
     * adds a single task to the database. do not used for recursive tasks. 
     * @param {*} username username of who the task belongs to
     * @param {*} date date of the task in the string format mm/dd/yyyy
     * @param {*} startTime start time of the task in the string format hh:mm
     * @param {*} endTime end time of the task in the string format hh:mm
     * @return the new id of the task or -1 if it wasn't added
     */
    async addTask(username, date, startTime, endTime) {
        //verify that user exists
        if (!(await UserHandler.current.userExists(username))) {
            throw new Error("Unable to add task to database. User \"" + username + "\" does not exist.");

        }

        //verify times and date are in the correct format
        if (!helpers.isDateFormat(date)) {
            throw new Error("Unable to add task to database. Date string is invalid");
        }

        if(!helpers.isTimeFormat(startTime)){
            throw new Error("Unable to add task to database. Start time string is invalid");
        }

        if(!helpers.isTimeFormat(endTime)){
            throw new Error("Unable to add task to database. End time string is invalid");
        }


        //everything is valid, add to database
        var taskId = await this._getNewTaskId();
        await DatabaseHandler.current.exec("INSERT INTO tasks (taskId, username, date, startTime, endTime, recursiveId) VALUES(?,?,?,?,?,-1)", [taskId, username, date, startTime, endTime]);


        return taskId;

    }
}