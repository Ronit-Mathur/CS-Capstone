/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';




module.exports = class Server {
    
    constructor() {
        //create and initialize the database handlers
        this.DatabaseHandler = new (require("./handlers/databaseHandler.js"))();
    }
}

