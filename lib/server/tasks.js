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

        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: day, auth: serverHandler.current.userState.auth});

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

        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, before: time,  auth: serverHandler.current.userState.auth });

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

        tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, after: time,  auth: serverHandler.current.userState.auth });

    }
    catch (err) {
        console.error("getTodaysActiveTasks unable to get tasks from the server");
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
async function addTask(user, summary, day, location, startTime, endTime) {
    var taskId = -1;
    try {

        taskId = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_ADD_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location });

    }
    catch (err) {
        console.error("addTask unable add task to the server");
        console.error(err);
    }
    return taskId;
}


/**
 * updates a tasks value in the database. true if succeeded
 * @param {*} user 
 * @param {*} taskId 
 * @param {*} summary 
 * @param {*} day 
 * @param {*} location 
 * @param {*} startTime 
 * @param {*} endTime 
 * @returns true if action succeeded 
 */
async function updateTask(user, taskId, summary, day, location, startTime, endTime) {
    var result = false;
    try {
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_UPDATE_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location, taskId: taskId });
        return result == "ok";
    }
    catch (err) {
        console.error("updateTask unable update task on the server");
        console.error(err);
    }
    return result;
}


/**
 * deletes a task by its id from the database
 * @param {*} id 
 */
async function deleteTask(id) {
    try {
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_DELETE_TASK, { id: id });
    } catch (e) {
        console.log("Unable to delete task \"" + id + "\" from the database");
        console.log(e);
    }

}


/**
 * completes a task with the given info
 * @param id id of the task to complete
 * @param {*} enjoyment enjoyment of the task from 1-5. 5 being the most
 * @param {*} physicalActivity phyiscal activity of the task from 1-5. 5 being the most
 * @param {*} engagement was the user engaged? from 1-5. 5 being the most
 * @param {*} mentalDifficulty mental difficult of the task from 1-5. 5 being the
 * @returns true if successful. false if not
 */
async function completeTask(id, enjoyment, physicalActivity, engagement, mentalDifficulty) {
    var result = false;
    try {
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_COMPLETE_TASK, { taskId: id, enjoyment: enjoyment, physicalActivity: physicalActivity, engagement: engagement, mentalDifficulty: mentalDifficulty });
        return result == "ok";
    }
    catch (err) {
        console.error("completeTask unable to complete task on the server");
        console.error(err);
    }
    return result;
}

export { addTask, getDaysTasks, getTodaysFinishedTasks, getTodaysActiveTasks, updateTask, deleteTask, completeTask }