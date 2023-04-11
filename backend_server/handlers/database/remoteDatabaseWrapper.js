const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const SERVER_CONSTANTS = require("../../serverConstants");


module.exports = class RemoteDatabaseWrapper{
    constructor(){
        
    }

    async getDBConnection(){
        var db = await sqlite.open({
            filename: SERVER_CONSTANTS.DATABASE_FILE,
            driver: sqlite3.Database
        });
        await db.run("PRAGMA foreign_keys = ON");
        return db;
    }
}