/**
 * functions that import data from external calendars into the database.
 */
const EXTERNAL_KEYS = require("./externalKeys");
const { google } = require('googleapis');
const outlook = require("node-outlook");
const moment = require('moment');




/**
 * @returns a google client for oauth2
 */
function _getGoogleOAuth2Client() {
    const oauth2Client = new google.auth.OAuth2(
        EXTERNAL_KEYS.GOOGLE_CLIENT_ID,
        EXTERNAL_KEYS.GOOGLE_SECRET,
        EXTERNAL_KEYS.GOOGLE_OAUTH_REDIRECT_URL
    );
    return oauth2Client;
}

/**
 * creates an oauth uri for the user to go to. Begins the google oauth process
 */
function createGoogleCalenderOAuthUri() {

    //setup oauth
    const oauth2Client = _getGoogleOAuth2Client();

    //generate the google calendar auth url to send to client
    const url = oauth2Client.generateAuthUrl({

        // If you only need one scope you can pass it as a string
        scope: "https://www.googleapis.com/auth/calendar.readonly",
    });

    return url;
}


/**
 * creates an authorized oauth2 client
 * @returns the authorized client
 */
async function getAuthorizedGoogleOAuth2Client(token) {
    const client = _getGoogleOAuth2Client();
    let { tokens } = await client.getToken(token);
    client.setCredentials(tokens);
    return client;

}



/**
 * gets a users google calendars. must be authed first
 * @param {*} client autheroized google client
 * @returns a list of google calendars
 */
async function getGoogleCalendarsFromClient(client) {
    const calendar = google.calendar('v3');
    const res = await calendar.calendarList.list({
        auth: client
    })
    var calendars = res.data.items;
    return calendars;

}


/**
 * gets an individual google calendar from a client. must be authed first
 * @param {*} client autorized google client
 * @param {*} id id of the calendar to grab
 * @returns a list of events in that calendar
 */
async function getGoogleEventsFromClient(client, id) {
    const calendar = google.calendar('v3');
    var startTime = moment().format("YYYY-MM-DDT00:01:00Z");
    const res = await calendar.events.list({
        auth: client,
        calendarId: id, timeMin: startTime, singleEvents: true,
        orderBy: 'startTime'
    });
    return res.data.items;
}



/**
 * creates an oauth uri for the user to go to. Begins the outlook oauth process
 */
function createOutlookCalendarOAuthUri() {

    //use outlook 2.0 api
    outlook.base.setApiEndpoint("https://outlook.office.com/api/v2.0");

}

module.exports = {
    createGoogleCalenderOAuthUri: createGoogleCalenderOAuthUri,
    getGoogleCalendarsFromClient: getGoogleCalendarsFromClient,
    getAuthorizedGoogleOAuth2Client: getAuthorizedGoogleOAuth2Client,
    createOutlookCalendarOAuthUri: createOutlookCalendarOAuthUri,
    getGoogleEventsFromClient: getGoogleEventsFromClient
}

