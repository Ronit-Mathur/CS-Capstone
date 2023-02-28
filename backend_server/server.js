/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';



const express = require('express');
const http = require('http');
const https = require('https');
const { createGoogleCalenderOAuthUri } = require('./lib/external_integration/calendarImports.js');
const serverConstants = require('./serverConstants.js');
const { SERVER_ENDPOINTS } = require('./serverConstants.js');
const fs = require('fs');
const calendarImports = require('./lib/external_integration/calendarImports.js');
const helpers = require('./lib/helpers');



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
        this.dayHandler = new (require('./handlers/dayHandler.js'))();





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
        *ssl auth
        * */
        app.use("/.well-known/pki-validation", express.static('./backend_server/static/ssl'));


        /**
         * user methods
         */
        app.get(SERVER_ENDPOINTS.USER_CREATE, async (req, res) => {
            if (req.query.username && req.query.password && req.query.email) {

                //check if user exists
                if (await this.userHandler.userExists(req.query.username)) {
                    res.status(400).send("user exists");
                    return;
                }

                //create user
                const created = await this.userHandler.createUser(req.query.username, req.query.email, req.query.password);
                if (!created) {
                    res.status(400).send("user creation error");
                    return;
                }


                //everything went okay
                res.status(201).send(JSON.stringify("User Created"));
                return
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });

        app.get(SERVER_ENDPOINTS.USER_EXISTS, async (req, res) => {
            if (req.query.username) {

                //check if user exists
                if (await this.userHandler.userExists(req.query.username)) {
                    res.status(200).send(JSON.stringify("true"));
                    return;
                }
                else {
                    res.status(200).send(JSON.stringify("false"));
                    return;
                }
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });

        /**
         * task methods
         */

        /**
         * access a users tasks by day
         */
        app.get(SERVER_ENDPOINTS.USER_TASKS_BY_DAY, async (req, res) => {
            if (req.query.username && req.query.day && helpers.isDateFormat(req.query.day)) {

                if (req.query.before) {
                    if (!helpers.isTimeFormat(req.query.before)) {
                        res.status(400).send("invalid time parameter");
                        return;
                    }

                    //query before
                    var returnTasks = await this.taskHandler.getTodaysFinishedTasks(req.query.username, req.query.day, req.query.before);
                    res.status(200).send(returnTasks);
                    return;
                }

                if (req.query.after) {
                    if (!helpers.isTimeFormat(req.query.after)) {
                        res.status(400).send("invalid time parameter");
                        return;
                    }

                    //query after
                    var returnTasks = await this.taskHandler.getTodaysActiveTasks(req.query.username, req.query.day, req.query.after);
                    res.status(200).send(returnTasks);
                    return;
                }

                const tasks = await this.taskHandler.getDaysTasks(req.query.username, req.query.day);
                res.status(200).send(tasks);
                return;
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });




        /**
         * add a task for a user
         */
        app.get(SERVER_ENDPOINTS.USER_ADD_TASK, async (req, res) => {
            if (req.query.username && req.query.day && helpers.isDateFormat(req.query.day) && req.query.summary && req.query.startTime && helpers.isTimeFormat(req.query.startTime) && req.query.endTime && helpers.isTimeFormat(req.query.endTime) && req.query.location) {
                const taskId = await this.taskHandler.addTask(req.query.username, req.query.summary, req.query.day, req.query.location, req.query.startTime, req.query.endTime);
                res.status(200).send(JSON.stringify(taskId));
                return;
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });

        /**
         * update a task for a user
         */
        app.get(SERVER_ENDPOINTS.USER_UPDATE_TASK, async (req, res) => {
            if (req.query.username && req.query.day && helpers.isDateFormat(req.query.day) && req.query.summary && req.query.startTime && helpers.isTimeFormat(req.query.startTime) && req.query.endTime && helpers.isTimeFormat(req.query.endTime) && req.query.location && req.query.taskId) {
                const result = await this.taskHandler.updateTask(req.query.taskId, req.query.username, req.query.summary, req.query.day, req.query.location, req.query.startTime, req.query.endTime);
                if (result) {
                    res.status(200).send(JSON.stringify("ok"));
                }
                else {
                    res.status(200).send(JSON.stringify("error"));
                }

                return;
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });

        /**
         * daily methods
         */

        app.get(SERVER_ENDPOINTS.USER_RATE_DAY, async (req, res) => {
            if (req.query.username, req.query.day, req.query.happiness) {
                await this.dayHandler.rateDay(req.query.username, req.query.day, req.query.happiness);
                res.status(200).send(JSON.stringify("done"));
            }
            else {
                res.status(400).send("invalid parameters");
                return;
            }
        });

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
            res.status(200).send(JSON.stringify("ok"));

        });


        /**
         * outlook oauth2
         */

        app.get(SERVER_ENDPOINTS.OUTLOOK_CALENDAR_OAUTH_BEGIN, async (req, res) => {
            var url = calendarImports.createOutlookCalendarOAuthUri();
            res.status(200).send(JSON.stringify(url));
        });

        /**
         * gets the response code from the oauth server
         */
        app.get(SERVER_ENDPOINTS.OUTLOOK_CALENDAR_OAUTH_RESPONSE, async (req, res) => {
            if (req.query.code) {


                res.status(200).send(serverConstants.DUMMY_PAGES.FINISHED_PAGE); //tell the client to close the window

                //store the data in the user handler
                await this.userHandler.completeOutlookAuthentication(req.ip, req.query.code);
                return;
            }
            else {
                res.status(400); //invalid query
                return;
            }
        });

        app.get(SERVER_ENDPOINTS.OUTLOOK_CALENDAR_LIST_CALENDARS, async (req, res) => {
            //check if user is authenticated
            if (!this.userHandler.hasOutlookAuthentication(req.ip)) {
                res.status(400);
            }

            //get calendars
            const calendars = await this.userHandler.getOutlookCalendars(req.ip);
            res.status(200).send(calendars);
            return;
        });

        /**
       * imports a users calendar from outlook given an id
       */
        app.get(SERVER_ENDPOINTS.OUTLOOK_CALENDAR_IMPORT_ENDPOINT, async (req, res) => {

            if (!req.query.id || !req.query.username || !this.userHandler.hasOutlookAuthentication(req.ip)) {
                res.status(400); //invalid query
            }

            //import calendar
            await this.userHandler.importOutlookCalendar(req.query.id, req.ip, req.query.username);
            res.status(200).send(JSON.stringify("ok"));

        });


        var privateKey = fs.readFileSync("./backend_server/certs/private.key");
        var certificate = fs.readFileSync("./backend_server/certs/certificate.crt");
        var ca = fs.readFileSync("./backend_server/certs/ca_bundle.crt");


        //start http server
        http.createServer(app).listen(80);


        //start https server
        https.createServer({
            key: privateKey,
            cert: certificate,
            ca: ca
        }, app).listen(443, () => {
            console.log(`Mental Health Tracker API running on ${this.port}`)
        })







    }
}

