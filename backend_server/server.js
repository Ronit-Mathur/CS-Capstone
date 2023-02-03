/**
 * The server can be deployed locally or remotely. Holds, manages and processes data for the client. Interacted through via it's rest api
 */
'use strict';




module.exports = class Server {
    
    /**
     * 
     * @param {boolean} isRemote whether or the server is remote
     */
    constructor(isRemote) {
        //create and initialize the database handlers
        this.DatabaseHandler = new (require("./handlers/databaseHandler.js"))(isRemote);
        this.userHandler = new (require("./handlers/userHandler.js"))();
        this.taskHandler = new (require("./handlers/taskHandler.js"))();
        
     
    }


    /**
     * starts the server. run after creating object
     */
    async start(){
        await this.DatabaseHandler.init();

    }
}

