/**
 * wrapper functions for task interactions on the server
 */

import { SERVER_ENDPOINTS } from "../../backend_server/serverConstants";

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
 * 
 * @param {*} month month to lookup tasks by in the format mm/yyyy
 * @returns a list of user task ids and dates within the month {taskId, date}
 */
async function getTasksByMonth(month){
    var tasks = []
    try{
        tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_BY_MONTH, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, month: month});
    }catch(e){
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
async function getTask(taskId){
    var task = null;
    try{
        task = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASK_BY_ID, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, taskId: taskId});
    }   
    catch(e){
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

        await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_ADD_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location, auth: serverHandler.current.userState.auth });
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
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_UPDATE_TASK, { username: user, summary: summary, day: day, startTime: startTime, endTime: endTime, location: location, taskId: taskId, auth: serverHandler.current.userState.auth });
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
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_DELETE_TASK, { id: id, auth: serverHandler.current.userState.auth });
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
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_RATE_TASK, { taskId: id, enjoyment: enjoyment, physicalActivity: physicalActivity, engagement: engagement, mentalDifficulty: mentalDifficulty, auth: serverHandler.current.userState.auth });
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
 * @returns the rating for the task with the associated id or null if it has not been rated.
 */
async function getTaskRating(id){
    var result = null;
    try{
        result = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_GET_TASK_RATING, {taskId: id, username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth});
    }catch{err}{
        console.log("unable to get rated task");
        console.log(err);
    }
    console.log("(getTaskRating helper) ID: " + id + "has rating: " + result);
    return result;
}


/**
 * 
 * @param {*} month month to lookup rated tasks by in the format mm/yyyy
 * @returns a list of user rated task ids and dates within the month {taskId, date}
 */
async function getTaskRatingsByMonth(month){
    var tasks = []
    try{
        tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_GET_TASK_RATINGS_BY_MONTH, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, month: month});
    }catch(e){
        console.log("getTaskRatingsByMonth unable to get tasks from the server");
        console.log(e);
    }

    return tasks;
}


/**
 * @returns a list of {taskId, date} of uncompleted tasks for a user
 */
async function getUnratedCompletedTasks(){
    var tasks = [];
    try{
        tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_NOT_RATED, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, epoch: Date.now()});
    }catch(e){
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
async function getRatedTasksByEngagement(engagement){
    var tasks = [];
    try{
        tasks = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_GET_RATED_TASKS_BY_ENGAGEMENT, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, engagement: engagement});
    }catch(e){
        console.log("getRatedTasksByEngagement unable to get tasks from the server");
        console.log(e);
    }

    return tasks;
}

async function totalCompletedTasks(){
    var count = -1;
    try{
        count = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.USER_TASKS_COUNT_COMPLETED, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth, time: Date.now()})
    }catch(e){
        console.log("totalCompletedTasks unable to get count from the server");
        console.log(e);
    }
    return count;
}

export {totalCompletedTasks, getRatedTasksByEngagement, getUnratedCompletedTasks, addTask, getDaysTasks, getTodaysFinishedTasks, getTodaysActiveTasks, updateTask, deleteTask, rateTask, getTaskRating, getTasksByMonth, getTask, getTaskRatingsByMonth }