/**
 * misc functions for oauthentication
 */

const { default: serverHandler } = require("../server/serverHandler");
import { Linking } from 'react-native'
import { SERVER_ENDPOINTS } from '../../backend_server/serverConstants';



/**
 * google calendar oauth
 */



/** 
 * opens a page for a google users to oauth into and then get's their calendars. beggining step of importing a users google calendars
 * @param callback function that takes a list of calendars
 */
async function getGoogleCalendars(callback) {
    //fetch oauth url from the server
    const uri = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.GOOGLE_CALENDAR_OAUTH_BEGIN, {});
    await Linking.openURL(uri);

    //ask the server for calendars every second. when we get a valid response, stop
    const askInt = setInterval(async () => {
        const resp = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.GOOGLE_CALENDAR_LIST_CALENDARS);
        if (resp != "error") {

            //if we get valid data, stop the interval and pass to the callback
            clearInterval(askInt);
            callback(resp);
        }
    }, 1000);




}

/**
 * asks the server to import a specific google calendar
 * @param {*} id id of the calendar to import
 */
async function importGoogleCalendar(id) {
    await serverHandler.current.fetchGet(SERVER_ENDPOINTS.GOOGLE_CALENDAR_IMPORT_ENDPOINT, { id: id, username: "testuser1" }); //fix username integration
}

/**
 * opens a page for an outlook user to oauth into and then get's their calendars. beggining step of importing a users outlook calendars
 * @param callback function that takes a list of calendars
 */
async function getOutlookCalendars(callback) {
    //fetch oauth url from the server
    const uri = await serverHandler.current.fetchGet(SERVER_ENDPOINTS.GOOGLE_CALENDAR_OAUTH_BEGIN, {});
    await Linking.openURL(uri);
}

export {
    getGoogleCalendars,
    importGoogleCalendar
}