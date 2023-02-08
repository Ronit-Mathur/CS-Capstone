/**
 * handles sqlite database interaction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../../serverConstants");
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

module.exports = class DatabaseHandler {

    static current; //current database handler being used by the server

    /**
     * 
     * @param {boolean} isRemote whether or not the database is remote
     */
    constructor(isRemote) {
        DatabaseHandler.current = this;
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

        //user table is needed even if not remote. cascade delete
        await db.run("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY UNIQUE, email TEXT UNIQUE, password TEXT)");



        //create data tables

        //tasks
        //a task is activity with a start and end date specific to a user. these can be recusrive where multiple tasks are linked
        //taskId - id belonging to the individual tasks
        //username - username belonging to the user who owns the task
        //date - date of the task in the format mm/dd/yyyy
        //startTime - the start time of the task. in the format hh:mm
        //endTime - the end time of the task. in the format hh:mm
        //rescursiveId - an id shared by all tasks which are linked or -1 if individual
        await db.run("CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY UNIQUE, username TEXT, date TEXT, startTime TEXT, endTime TEXT, recursiveId INTEGER , FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)");

        //completedTasks
        //a completed task is added data for a task. contains data about how the task was performed.
        //taskId - id belonging to the individual task. references the tasks table
        //enjoyment - how much the user enjoyed the tasks. scale 1-5. 5 being greatest
        //physicalActivity - how physically active the user was. scale 1-5. 5 being greatest
        //engagement - how engaged the user was mentally. scale 1-5. 5 being greatest
        //mentalDifficulty - how mentally difficult the task was. scale 1-5. 5 being greatest
        await db.run("CREATE TABLE IF NOT EXISTS completedTasks (taskId INTEGER  PRIMARY KEY UNIQUE, enjoyment INTEGER , phyiscalActivity INTEGER , engagement INTEGER , mentalDifficulty INTEGER , FOREIGN KEY(taskId) REFERENCES tasks(taskId) ON DELETE CASCADE)");

        //daily
        //a rating of individual days for users
        //date - date of the day in the format mm/dd/yyyy
        //username - the user which the day belongs to. linked to the users table
        //happiness - a happiness value associated with the whole day. scale 1-5. 5 being greated
        //rating - a general summary rating for the day made from pre-existing data. floating point number from 0-1;
        await db.run("CREATE TABLE IF NOT EXISTS daily (date TEXT, username TEXT, happiness INTEGER , rating REAL, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, PRIMARY KEY(date, username))");


        //close connection
        db.close();
    }


    /**
     * @summary gets a connection to the database
     * @returns database connection
     */
    async _getDBConnection() {
        var db = await sqlite.open({
            filename: SERVER_CONSTANTS.DATABASE_FILE,
            driver: sqlite3.Database
        });
        await db.run("PRAGMA foreign_keys = ON");
        return db;
    }


    /**
     * executes an sql statement on the datbase with no return
     * @param {*} statement statement to execute
     */
    async exec(statement, params){
        var db = await this._getDBConnection();
        await db.run(statement, params);
        await db.close();
    }



    /**
     * queries the database with a given query
     * @param {*} statement statement to query db with
     * @returns response from the database
     */
    async query(statement,params){
        var db = await this._getDBConnection();
        var response = await db.all(statement,params);
        await db.close();
        return response;
    }
}