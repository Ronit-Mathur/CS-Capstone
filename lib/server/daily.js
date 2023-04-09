import serverHandler from "./serverHandler";
import serverConstants from "../../backend_server/serverConstants";
import helpers from "../../backend_server/lib/helpers";

/**
 * rates the day on the server
 * @param {*} username username of the day
 * @param {*} happiness happiness value from 1-5
 */
async function rateDay(username, happiness){
    try {
        const now = Date.now();
        const day = helpers.getTodaysDate();
        const resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_RATE_DAY, { username:  serverHandler.current.userState.username, day: day, time:now, happiness:happiness, auth: serverHandler.current.userState.auth });
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}


/**
 * 
 * @param {*} day 
 * @returns a daily object for a specific day. {date, time, username, happiness, rating} or null if the day has not been rated yet
 */
async function getDay(day){
    var dayObj = null;
    try{
        dayObj = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_GET_DAY_RATING, {username:   serverHandler.current.userState.username, day: day, auth: serverHandler.current.userState.auth});

    
    }catch(e){

        return null;
    }

    return dayObj;

}


async function totalRates(){
    var count = -1;
    try{
        count = await  await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_DAILY_COUNT, {username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth});

    }catch(e){
        console.log("totalRates unable to get count from the server");
        console.log(e);
    }
    return count;
}

export {rateDay, getDay, totalRates};
