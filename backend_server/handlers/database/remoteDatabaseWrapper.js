const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const SERVER_CONSTANTS = require("../../serverConstants");


module.exports = class RemoteDatabaseWrapper {
    constructor() {

    }

    async getDBConnection() {
        var db = await sqlite.open({
            filename: SERVER_CONSTANTS.DATABASE_FILE,
            driver: sqlite3.Database
        });
        await db.run("PRAGMA foreign_keys = ON");
        return db;
    }

    async exec(statement, params) {
        try {
            var db = await this.getDBConnection();
            await db.run(statement, params);
            await db.close();
        }
        catch (e) {
            console.log("database handler unable to execute run \"" + statement + "\"");
            console.log("Params: " + params);
            console.log(e);
        }
    }

    async query(statement, params) {
        let response;
        try {
            var db = await this.getDBConnection();
            response = await db.all(statement, params);
            await db.close();
        }
        catch (e) {
            console.log("database handler unable to execute query \"" + statement + "\"");
            console.log("Params: " + params);
            console.log(e);
            response = [];
        }
        return response;
    }

    
}