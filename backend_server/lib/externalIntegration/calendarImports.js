/**
 * functions that import data from external calendars into the database.
 */
const EXTERNAL_KEYS = require("./externalKeys");
const { google } = require('googleapis');
const outlook = require("node-outlook");



/**
 * creates an oauth uri for the user to go to. Begins the google oauth process
 */
function createGoogleCalenderOAuthUri() {

    //setup oauth
    const oauth2Client = new google.auth.OAuth2(
        EXTERNAL_KEYS.GOOGLE_CLIENT_ID,
        EXTERNAL_KEYS.GOOGLE_SECRET,
        "http://localhost:6000"
    );

    //generate the google calendar auth url to send to client
    const url = oauth2Client.generateAuthUrl({

        // If you only need one scope you can pass it as a string
        scope: "https://www.googleapis.com/auth/calendar"
    });

    return url;
}


/**
 * creates an oauth uri for the user to go to. Begins the outlook oauth process
 */
function createOutlookCalendarOAuthUri(){

    //use outlook 2.0 api
    outlook.base.setApiEndpoint("https://outlook.office.com/api/v2.0");

}

module.exports = {
    createGoogleCalenderOAuthUri : createGoogleCalenderOAuthUri,
    createOutlookCalendarOAuthUri: createOutlookCalendarOAuthUri
}

