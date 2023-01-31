/**
 * handles sqlite database interaction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../serverConstants");
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

module.exports = class DatabaseHandler {


    /**
     * 
     * @param {boolean} isRemote whether or not the database is remote
     */
    constructor(isRemote) {
        this.isRemote = isRemote;
      

    }

    /**
     * run after creating handler.
     */
    async init() {
        await this._initDatabase();
    }


    /**
     * @summary initializes the database. will not overwrite any data. run each time when handler is started
     */
    async _initDatabase() {

      
        //get a connection to the on-disk database. will create one if dosent exist
        const db = await this._getDBConnection();
        //create tables if not exist
        if (this.isRemote) {
            console.log("creating");
            //if remote, create user and password tables
            await db.run("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY UNIQUE, email TEXT UNIQUE, password TEXT)");
            console.log("created");
        }






        //close connection
        db.close();
    }


    /**
     * @summary gets a connection to the database
     * @returns database connection
     */
    async _getDBConnection() {
        return await sqlite.open({
            filename: SERVER_CONSTANTS.DATABASE_FILE,
            driver: sqlite3.Database
        })
    }
}