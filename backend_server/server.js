/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';
const express = require('express');



module.exports = class Server {

    /**
     * 
     * @param {boolean} isRemote whether or the server is remote
     * @param {int} port port to run the server on
     */
    constructor(isRemote, port) {
        this.isRemote = isRemote;
        this.port = port;
        //create and initialize the database handlers
        this.DatabaseHandler = new (require("./handlers/databaseHandler.js"))(isRemote);
        this.userHandler = new (require("./handlers/userHandler.js"))();
        this.taskHandler = new (require("./handlers/taskHandler.js"))();


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

        app.listen(this.port, () => {
            console.log(`Mental Health Tracker API running on ${this.port}`)
        })

    }
}

