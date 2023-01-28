/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';


const DatabaseHandler = require("./handlers/databaseHandler.js");

module.exports = class Server {
    constructor() {
        //create and initialize the database handlers
        const databaseHandler = new DatabaseHandler();
    }
}

