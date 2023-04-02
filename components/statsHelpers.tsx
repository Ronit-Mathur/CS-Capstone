import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, getDaysTasks, getTaskRating, rateTask} from '../lib/server/tasks';
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
    for (const task of ratedTasks) {
        console.log(task.taskId);
        tmpTaskRating = await getTaskRating(task.taskId);
        console.log("Task ID: " + task.taskId + " has rating: " + tmpTaskRating);
        if (tmpTaskRating != null) {
            moodRatingList.push(tmpTaskRating);
        }
    }

    moodRatingList.forEach(function(rating) {
        dayAvgMood += rating; // Add task ratings
    })
    dayAvgMood = dayAvgMood/moodRatingList.length; // Average ratings for specified date (no date returned
    if (dayAvgMood !>= 0) {
        return "Error Calculating Days Average Mood"
    }
    return dayAvgMood;
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

export {getNumRated, calcDayMood, rateManualTask};