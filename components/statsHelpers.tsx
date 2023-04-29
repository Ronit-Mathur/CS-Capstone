import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, getDaysTasks, getTaskRating, rateTask, getAllRatedTasks, getTaskRatingsByMonth} from '../lib/server/tasks';
import { useNavigation} from '@react-navigation/native';
import {getUser} from './homescreen'
import { getDay } from '../lib/server/daily';
import serverHandler from '../lib/server/serverHandler';

async function getDateMoodList() {

}

async function getWeeklyAvgs(dateObject: any) { // Current year, retrieved monthly for now
    var dates = dateObject.days;
    var ratings = dateObject.ratings;
    var tmpDate;
    var dayOfWeekDates = [];
    var dayOfWeekRatings = [0,0,0,0,0,0,0]
    for (let i = 0; i < ratings.length; i++) {
        tmpDate = dateObject.month + "/" + dates[i] + "/" + dateObject.year;
        var tDay = Helpers.MMDDYYYYtoDate(tmpDate);
        var tmp = tDay.getDay();
        dayOfWeekDates.push(tmp);
    }
    for (let i = 0; i < 6; i++) {
        var iDayRating;
        var count = 0;
        var tmpTRatings = 0;
        for (let v = 0; v <= dayOfWeekDates.length; v++) {
            if (dayOfWeekDates[v] == i) {
                tmpTRatings += ratings[v];
                count++;
            }
        }
        if (count > 0) {
            iDayRating = tmpTRatings / count;
            dayOfWeekRatings[i] = iDayRating;
        }
        iDayRating = 0;
        count = 0;
        tmpTRatings = 0;
    }

    return dayOfWeekRatings;
}

async function calcDayMood(user: any, day: any) {
    var ratedTaskIDs = [];
    var moodRatingList = [];
    var dayAvgMood = 0;

    // Add daily mood rating
    var dayMood = await getDay(day); // Day object
    //console.log("Day object:");
    //console.log(dayMood);
    if (dayMood != null) {
        // console.log("DAY is NOT NULL");
        moodRatingList.push(dayMood.happiness); // Add day rating
    }

    // Add task ratings for day
    var tmpTaskRating;
    var ratedTasks = await getDaysRatedTasks(day); // day: mm/dd/yyy
    // console.log(ratedTasks);
    if (ratedTasks == [] && dayMood == null) {
        return -1
    } else if (ratedTasks != []) {
        for (var task of ratedTasks) {
            // console.log(task.taskId); // Logged ID
            tmpTaskRating = await getTaskRating(task.taskId); // TODO Throws error when task is not rated
            // console.log("Task ID: " + task.taskId + " has rating: " + tmpTaskRating.enjoyment);
            if (tmpTaskRating != null) {
                moodRatingList.push(tmpTaskRating.enjoyment);
            }
        }
    }
    
    // console.log("Mood rating list pre calc: ");
    // console.log(moodRatingList);

    if(moodRatingList == []) {
        // console.log("MOOD RATING LIST IS EMPTY")
        return -1
    }
    moodRatingList.forEach(function(rating) {
        dayAvgMood += rating; // Add task ratings
    })
    dayAvgMood = dayAvgMood/moodRatingList.length; // Average ratings for specified date (no date returned
    // console.log("DayAvgMood Calc = " + dayAvgMood);
    if (dayAvgMood == 0 || dayAvgMood < 0) {
        return "Error Calculating Days Average Mood"
    }
    return dayAvgMood;
}

/* 
month: mm/yyyy
*/
async function getMonthAvgRatings(month: any) {
    // console.log("GETMONTHAVGRATINGSRUN")
    var [m, yr] = month.split('/');
    var singleDigitMonth = parseInt(m) - 1; //Parsed -1 to account for 0
    // console.log(singleDigitMonth);
    var intYear = parseInt(yr);
    //const daysInMonthFunc = (y, m) => new Date(y, m, 0).getDate(); // Function
    
    var tD = new Date(intYear, singleDigitMonth, 0);
    const daysInMonth = tD.getDate() - 1; // -1
    // console.log(daysInMonth);
    var monthDaysRatings = {
        month: m,
        year: yr,
        days: [],
        ratings: []
    }
    
    var dayArray = [];
    var ratingArray = [];
    
    const tmpStart = new Date(intYear, singleDigitMonth, 1);
    const tmpEnd = new Date(intYear, singleDigitMonth, daysInMonth);
    // console.log(tmpStart);
    // console.log(tmpEnd);
    var loop = tmpStart;
    //var tmpDay, tmpRating, loopDay;
    while(loop <= tmpEnd) {
        // console.log("While begin");
        var tmpDay = (loop.getDate() < 10 ? '0' : '') + loop.getDate();
        // console.log(tmpDay);
        var loopDay = Helpers.dateToMMDDYYYY(loop);
        // console.log(loopDay);
        var tmpRating = await calcDayMood(serverHandler.current.userState.username, loopDay);
        // console.log(tmpRating);
        if (tmpRating > -1) {
            // console.log("Rating Added")
            // console.log(tmpRating);
            dayArray.push(tmpDay);
            ratingArray.push(tmpRating);
        }
        
        // Iterate Date
        var newLoopDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newLoopDate);
        // console.log(loop);
        // console.log("While end");
    }
    // console.log(dayArray);
    // console.log(ratingArray);
    monthDaysRatings.days = dayArray;
    monthDaysRatings.ratings = ratingArray;
    
    
    /* const monthRatingTasks = await getTaskRatingsByMonth(month); // {taskId, date}
    console.log(monthRatingTasks);
    var tmprtg = 0;
    var tmpDate;
    for (var task of monthRatingTasks) {
        console.log(task);
        if (task.date != tmpDate) {
            tmpDate = task.date;
            tmprtg = await calcDayMood(serverHandler.current.userState.username, tmpDate);
            dateRatings.push({tmpDate, tmprtg}); // {date, dayRatingAvg}
            console.log(dateRatings);
        }
        console.log(monthRatingTasks);
        return dateRatings;
    } */
    
    //console.log(monthDaysRatings);
    return monthDaysRatings;
}

async function getDaysRatedTasks(day: any) {
    var allRatedTasks = await getAllRatedTasks();
    var daysRatedTasks = [];
    for (task of allRatedTasks) {
        if (task.date == day) {
            daysRatedTasks.push(task);
        }
    }
    return daysRatedTasks;
}

async function rateManualTask(taskID: any) {
    rateTask(taskID, 4, 3, 4, 4);
}

// async function retrieveTaskRating(taskID: any) {
//     var tmp = await getTaskRating(taskID);
//     return tmp
// }

export {getDateMoodList, getWeeklyAvgs, getDaysRatedTasks, calcDayMood, rateManualTask, getMonthAvgRatings};