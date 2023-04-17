/**
 * wrapper functions for task interactions on the server
 */

import taskHandler from "../../backend_server/handlers/taskHandler";
import UserHandler from "../../backend_server/handlers/userHandler";
import { SERVER_ENDPOINTS } from "../../backend_server/serverConstants";
import { isRemoteAsync } from "./users";

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
        if (await isRemoteAsync()) {


            tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: day, auth: serverHandler.current.userState.auth });
        }
        else {
            tasks = await taskHandler.current.getDaysTasks(serverHandler.current.userState.username);
        }

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

        if (await isRemoteAsync()) {

            tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, before: time, auth: serverHandler.current.userState.auth });
        }
        else {
            tasks = await taskHandler.current.getTodaysFinishedTasks(serverHandler.current.userState.username, today, time);
        }
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

        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_TASKS_BY_DAY, { username: user, day: today, after: time, auth: serverHandler.current.userState.auth });
        } else {
            tasks = await taskHandler.current.getTodaysActiveTasks(serverHandler.current.userState.username, today, time);
        }
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
 * 
 * @param {*} month month to lookup tasks by in the format mm/yyyy
 * @returns a list of user task ids and dates within the month {taskId, date}
 */
async function getTasksByMonth(month) {
    var tasks = []
    try {
        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_BY_MONTH, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, month: month });
        }
        else {
            tasks = await taskHandler.current.getMonthsTasks(month, serverHandler.current.userState.username);
        }
    } catch (e) {
        console.log("getTasksByMonth unable to get tasks from the server");
        console.log(e);
    }

    return tasks;
}


/**
 * 
 * @param {*} taskId id of the task
 * @returns a task object or null if it dosent exist
 */
async function getTask(taskId) {
    var task = null;
    try {

        if (await isRemoteAsync()) {
            task = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASK_BY_ID, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, taskId: taskId });
        } else {
            task = await taskHandler.current.getTask(taskId);
        }
    }
    catch (e) {
        console.log("getTask unable to get task from the server");
        console.log(e);
    }
    return task;
}

/**
 * adds a task to a user's database
 * @param {*} user username the task belongs to
 * @param {*} summary summary of the task
 * @param {*} day day of the task in the format mm/dd/yyyy
 * @param {*} startTime start time of the task in hh:mm format
 * @param {*} endTime end time of the task in hh:mm format
 * @returns true of false if the task was created
 */
async function addTask(user, summary, day, location, startTime, endTime) {
    var result = false;
    try {

        if (await isRemoteAsync()) {
            await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_ADD_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location, auth: serverHandler.current.userState.auth });
        }
        else {
            await taskHandler.current.addTask(serverHandler.current.userState.username, summary, day, location, startTime, endTime, 1);
        }
        result = true;

    }
    catch (err) {
        console.error("addTask unable add task to the server");
        console.error(err);
    }
    return result;
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
        if (await isRemoteAsync()) {
            result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_UPDATE_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location, taskId: taskId, auth: serverHandler.current.userState.auth });
        }
        else {
            result = await taskHandler.current.updateTask(taskId, serverHandler.current.userState.username, summary, day, location, startTime, endTime);
        }
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
        if (await isRemoteAsync()) {
            result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_DELETE_TASK, { id: id, auth: serverHandler.current.userState.auth });
        } else {
            result = await taskHandler.current.deleteTask(id);
        }
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
async function rateTask(id, enjoyment, physicalActivity, engagement, mentalDifficulty) {
    var result = false;
    try {
        if (await isRemoteAsync()) {


            result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_RATE_TASK, { taskId: id, enjoyment: enjoyment, physicalActivity: physicalActivity, engagement: engagement, mentalDifficulty: mentalDifficulty, username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
        } else {
            result = await taskHandler.current.rateTask(id, enjoyment, physicalActivity, engagement, mentalDifficulty);
        }
        return result == "ok";
    }
    catch (err) {
        console.error("completeTask unable to complete task on the server");
        console.error(err);
    }
    return result;
}

/**
 * looks up the rating for a rated task. must belong to the user that is calling it
 * @param {*} id 
 * @returns the ratings ( {"engagement": #, "enjoyment": #, "mentalDifficulty": #, "phyiscalActivity": #, "taskId": ###}) ) for the task with the associated id or null if it has not been rated.
 */
async function getTaskRating(id) {
    var result = null;
    try {
        if (await isRemoteAsync()) {
            result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_GET_TASK_RATING, { taskId: id, username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
        } else {
            result = await taskHandler.current.getRatedTask(id);
        }
    } catch { err } {
        console.log("unable to get rated task");
        //console.log(err);
    }
    console.log("(getTaskRating helper) ID: " + id + "has rating: ");
    console.log(result);
    return result;
}


/**
 * 
 * @param {*} month month to lookup rated tasks by in the format mm/yyyy
 * @returns a list of user rated task ids and dates within the month {taskId, date}
 */
async function getTaskRatingsByMonth(month) {
    var tasks = []
    try {
        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_GET_TASK_RATINGS_BY_MONTH, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, month: month });
        } else {
            tasks = await taskHandler.current.getMonthsTasks(month, serverHandler.current.userState.username);
        }
    } catch (e) {
        console.log("getTaskRatingsByMonth unable to get tasks from the server");
        //console.log(e);
    }

    return tasks;
}


/**
 * @returns a list of {taskId, date} of uncompleted tasks for a user
 */
async function getUnratedCompletedTasks() {
    var tasks = [];
    try {
        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_NOT_RATED, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, epoch: Date.now() });
        } else {
            tasks = await taskHandler.current.getUnratedCompletedTasks(serverHandler.current.userState.username, Date.now());
        }
    } catch (e) {
        console.log("getUnratedCompletedTasks unable to get tasks from the server");
        console.log(e);
    }

    return tasks;
}


/**
 * 
 * @param {*} engagement 
 * @returns a list of {taskId, date} of rated tasks with the engagement value
 */
async function getRatedTasksByEngagement(engagement) {
    var tasks = [];
    try {
        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_GET_RATED_TASKS_BY_ENGAGEMENT, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, engagement: engagement });
        } else {
            tasks = await taskHandler.current.getRatedByEngagement(serverHandler.current.userState.username, engagement);
        }
    } catch (e) {
        console.log("getRatedTasksByEngagement unable to get tasks from the server");
        console.log(e);
    }

    return tasks;
}

async function totalCompletedTasks() {
    var count = -1;
    try {
        if (await isRemoteAsync()) {
            count = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_COUNT_COMPLETED, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, time: Date.now() })
        }
        else {
            count = await taskHandler.current.totalCompletedTasks(serverHandler.current.userState.username, Date.now());
        }
    } catch (e) {
        console.log("totalCompletedTasks unable to get count from the server");
        console.log(e);
    }
    return count;
}

async function totalRatedTasks() {
    var count = -1;
    try {
        if (await isRemoteAsync()) {
            count = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_COUNT_RATED, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
        }
        else {
            count = await taskHandler.current.totalRatedTasks(serverHandler.current.userState.username);
        }
    } catch (e) {
        console.log("totalRatedTasks unable to get count from the server");
        console.log(e);
    }
    return count;
}

async function tasksWithDate() {
    var tasks = []
    try {
        if (await isRemoteAsync()) {
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_DATES, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
        }else{
            tasks = await taskHandler.current.datesWithTask(serverHandler.current.userState.username);
        }
    }
    catch (e) {
        console.log("tasksWithDate unable to get dates from the server");
        console.log(e);
    }
    return tasks;

}

async function leastEnjoyableTask(){
    var task = [];
    try{
        if(await isRemoteAsync()){
            task = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASK_LEAST_ENJOYABLE, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth});

        }
        else{
            task = await taskHandler.current.leastEnjoyableTask(serverHandler.current.userState.username);
        }
    }
    catch (e) {
        console.log("leastEnjoyableTask unable to get task from the server");
        console.log(e);
    }
    return task;
}


async function happiestWhenDayStartsWith(){
    var task = [];
    try{
        if(await isRemoteAsync()){
            task = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASK_HAPPIEST_WHEN_DAY_STARTS_WITH, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth});

        }
        else{
            task = await taskHandler.current.happiestWhenDayStartsWith(serverHandler.current.userState.username);
        }
    }
    catch (e) {
        console.log("happiestWhenDayStartsWith unable to get task from the server");
        console.log(e);
    }
    return task;
}

async function getAllRatedTasks(){
    var tasks = [];
    try{
        if(await isRemoteAsync()){
            tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_GET_TASK_RATINGS_ALL, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth});

        }
        else{
            tasks = await taskHandler.current.getAllRatedTasks(serverHandler.current.userState.username);
        }
    }
    catch (e) {
        console.log("getAllRatedTasks unable to get task from the server");
        console.log(e);
    }
    return tasks;

}



/**
 * @returns the next task for the given user
 */
async function nextTask(){
    var task = null;
    try{
        if(await isRemoteAsync()){
            task = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASK_NEXT, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, time: Date.now()});

        }
        else{
            task = await taskHandler.current.nextTask(serverHandler.current.userState.username, Date.now());
        }
    }
    catch (e) {
        console.log("getAllRatedTasks unable to get task from the server");
        console.log(e);
    }
    return tasks;
}

export {nextTask, getAllRatedTasks, leastEnjoyableTask, happiestWhenDayStartsWith, tasksWithDate, totalRatedTasks, totalCompletedTasks, getRatedTasksByEngagement, getUnratedCompletedTasks, addTask, getDaysTasks, getTodaysFinishedTasks, getTodaysActiveTasks, updateTask, deleteTask, rateTask, getTaskRating, getTasksByMonth, getTask, getTaskRatingsByMonth }