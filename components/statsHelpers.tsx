import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, getDaysTasks, getTaskRating, rateTask, getTaskRatingsByMonth} from '../lib/server/tasks';
import { useNavigation} from '@react-navigation/native';
import {getUser} from './homescreen'
import { getDay } from '../lib/server/daily';

async function calcDayMood(user: any, day: any) {
    var ratedTaskIDs = [];
    var moodRatingList = [];
    var dayAvgMood = 0;
    var dayMood = await getDay(day); // Day object
    console.log("day is: " + dayMood);
    if (dayMood != null) {
        moodRatingList.push(dayMood.happiness); // Add day rating
    }

    var tmpTaskRating;
    const ratedTasks = await getDaysTasks(user, day); // mm/dd/yyy
    console.log(ratedTasks);
    for (var task of ratedTasks) {
        console.log(task.taskId);
        tmpTaskRating = await getTaskRating(task.taskId);
        console.log("Task ID: " + task.taskId + " has rating: " + tmpTaskRating);
        if (tmpTaskRating != null) {
            moodRatingList.push(tmpTaskRating);
        }
    }
    console.log("Mood rating list pre calc" + moodRatingList);
    moodRatingList.forEach(function(rating) {
        dayAvgMood += rating; // Add task ratings
    })
    dayAvgMood = dayAvgMood/moodRatingList.length; // Average ratings for specified date (no date returned
    console.log("DayAvgMood Calc = " + dayAvgMood);
    if (dayAvgMood !>= 0) {
        return "Error Calculating Days Average Mood"
    }
    return dayAvgMood;
}

/* 
month: mm/yyyy
*/
async function getTaskRatingsMonth(user: any, month: any) {
    var dateRatings = [];
    const monthRatingTasks = await getTaskRatingsByMonth(month); // {taskId, date}
    var tmprtg;
    for (var task of monthRatingTasks) {
        tmprtg = await getTaskRating(task.taskid);
    }
    console.log(monthRatingTasks);
}

async function getNumRated(user: any) {
    
}

async function rateManualTask(taskID: any) {
    rateTask(taskID, 4, 3, 4, 4);
}

// async function retrieveTaskRating(taskID: any) {
//     var tmp = await getTaskRating(taskID);
//     return tmp
// }

export {getNumRated, calcDayMood, rateManualTask, getTaskRatingsMonth};