/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';



const express = require('express');
const calendarImports = require('./lib/external_integration/calendarImports.js');
const { createGoogleCalenderOAuthUri } = require('./lib/external_integration/calendarImports.js');
const serverConstants = require('./serverConstants.js');
const { SERVER_ENDPOINTS } = require('./serverConstants.js');



module.exports = class Server {

    static current; //the current instance of the server

    /**
     * 
     * @param {boolean} isRemote whether or the server is remote
     * @param {int} port port to run the server on
     */
    constructor(isRemote, port) {
        Server.current = this;
        this.isRemote = isRemote;
        this.port = port;
        //create and initialize the database handlers
        this.DatabaseHandler = new (require("./handlers/databaseHandler.js"))(isRemote);
        this.userHandler = new (require("./handlers/userHandler.js"))();
        this.taskHandler = new (require("./handlers/taskHandler.js"))();



    }

    getUserHandler() {
        return this.userHandler;
    }

    getTaskHandler() {
        return this.taskHandler;
    }


    /**
     * starts the server. run after creating object
     */
    async start() {
        await this.DatabaseHandler.init();



        const app = express();
        app.get('/', (req, res) => {
            res.send('Mental Health Tracker API')

        })


        /**
         * google oauth2
         */

        /**
         * begins the oauth login process for google calendar
         * sends a google oauth link back to the user to begin login
         */
        app.get(SERVER_ENDPOINTS.GOOGLE_CALENDAR_OAUTH_BEGIN, (req, res) => {
            const uri = createGoogleCalenderOAuthUri();
            res.status(200).send(JSON.stringify(uri));
        });

        /**
         * gets the resulting authorization code from google and sends it to the backend
         * then closes the window
         */
        app.get(SERVER_ENDPOINTS.GOOGLE_CALENDAR_OAUTH_RESPONSE, async (req, res) => {
            if (req.query.code) {


                res.status(200).send(serverConstants.DUMMY_PAGES.FINISHED_PAGE); //tell the client to close the window

                //store the data in the user handler
                await this.userHandler.completeGoogleAuthentication(req.ip, req.query.code);
                return;
            }
            else {
                res.status(400); //invalid query
                return;
            }
        });


        /**
         * lists the calendars for the given google user. must have oauthed first
         */
        app.get(SERVER_ENDPOINTS.GOOGLE_CALENDAR_LIST_CALENDARS, async (req, res) => {

            //check if user is authenticated
            if (!this.userHandler.hasGoogleAuthentication(req.ip)) {
                res.status(400);
            }

            //get calendars
            const calendars = await this.userHandler.getGoogleCalendars(req.ip);
            res.status(200).send(calendars);
            return;

        });



        /**
         * imports a users calendar from google given an id
         */
        app.get(SERVER_ENDPOINTS.GOOGLE_CALENDAR_IMPORT_ENDPOINT, async (req, res) => {

            if (!req.query.id || !req.query.username || !this.userHandler.hasGoogleAuthentication(req.ip)) {
                res.status(400); //invalid query
            }

            //import calendar
            await this.userHandler.importGoogleCalendar(req.query.id, req.ip, req.query.username);
            res.status(200).send("ok");

        });

        app.listen(this.port, () => {
            console.log(`Mental Health Tracker API running on ${this.port}`)
        })

    }
}

