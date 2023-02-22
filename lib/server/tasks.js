/**
 * wrapper functions for task interactions on the server
 */

const serverConstants = require("../../backend_server/serverConstants");
const { default: serverHandler } = require("./serverHandler");
const helpers = require("../../backend_server/lib/helpers");


/**
 * gets a user's tasks from the server
 * @param {*} user the username of the user
 * @param {*} day the day of the tasks in the format mm/dd/yyyy
 * @returns a list of user tasks in order of occurence
 */
async function getDaysTasks(user, day) {

    var tasks = [];
    try {
        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: day });

    }
    catch (err) {
        console.error("getDaysTasks unable to get tasks from the server");
        console.error(err);
    }
    finally {
        return tasks;
    }
}

/**
 * gets a user's finished tasks from the server
 * @param {*} user the username of the user
 * @returns a list of user tasks in order of occurence
 */
async function getTodaysFinishedTasks(user) {
    var tasks = [];
    try {
        var today = helpers.getTodaysDate();
        var time = helpers.getCurrentTime();

        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, before: time });

    }
    catch (err) {
        console.error("getTodaysFinishedTasks unable to get tasks from the server");
        console.error(err);
    }
    finally {
        return tasks;
    }
}

/**
 * gets a user's active tasks from the server
 * @param {*} user the username of the user
 * @returns a list of user tasks in order of occurence
 */
async function getTodaysActiveTasks(user) {
    var tasks = [];
    try {
        var today = helpers.getTodaysDate();
        var time = helpers.getCurrentTime();

        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, after: time });

    }
    catch (err) {
        console.error("getTodaysFinishedTasks unable to get tasks from the server");
        console.error(err);
    }
    finally {
        return tasks;
    }
}

/**
 * adds a task to a user's database
 * @param {*} user username the task belongs to
 * @param {*} summary summary of the task
 * @param {*} day day of the task in the format mm/dd/yyyy
 * @param {*} startTime start time of the task in hh:mm format
 * @param {*} endTime end time of the task in hh:mm format
 * @returns the id of the new task or -1 if there was an issue
 */
async function addTask(user, summary, day, startTime, endTime) {
    var taskId = -1;
    try {
        taskId = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_ADD_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime });

    }
    catch (err) {
        console.error("addTask unable add task to the server");
        console.error(err);
    }
    return taskId;
}

export { addTask, getDaysTasks }