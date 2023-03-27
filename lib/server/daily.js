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
        const resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_RATE_DAY, { username: username, day: day, time:time, happiness:happiness, auth: serverHandler.current.userState.auth });
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
        dayObj = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_GET_DAY_RATING, {username: username, day: day, auth: serverHandler.current.userState.auth});

    
    }catch(e){
        console.log(day);
        return null;
    }

    return dayObj;

}


export {rateDay, getDay};
