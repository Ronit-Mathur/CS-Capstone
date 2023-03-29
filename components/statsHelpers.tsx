import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, getDaysTasks, getTaskRating} from '../lib/server/tasks';
import { useNavigation} from '@react-navigation/native';
import {getUser} from './homescreen'
import { getDay } from '../lib/server/daily';

async function calcDayMood(user: any, day: any) {
    var ratedTaskIDs = [];
    var moodRatingList = [];
    var dayAvgMood = 0;
    var dayMood = await getDay(day);
    if (dayMood != null) {
        console.log(dayMood);
        moodRatingList.push(dayMood.happiness); // Add day rating
    }

    var tmpTaskRating;
    const ratedTasks = await getDaysTasks(user, day);
    console.log(ratedTasks);
    ratedTasks.forEach(function(task: { taskId: number; }) {
        console.log(task);
        tmpTaskRating = getTaskRating(task.taskId);
        if (tmpTaskRating != null) {
            moodRatingList.push(tmpTaskRating);
        }
    })

    moodRatingList.forEach(function(rating) {
        dayAvgMood += rating; // Add task ratings
    })
    dayAvgMood = dayAvgMood/moodRatingList.length; // Average ratings
}

export {calcDayMood};