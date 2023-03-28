/**
 * handles sqlite database INTEGER eraction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../serverConstants");
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const PriorityQueue = require('priority-queue-node')
const helpers = require("../lib/helpers");


module.exports = class DatabaseHandler {

    static current; //current database handler being used by the server

    currentOperation = false; //the current operation being processed




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
        this._initOperationQueue();
    }


    /**
     * the operation queue is a priority queue which dictates which sql statement or query should be executed next
     */
    _initOperationQueue() {
        this.operationQueue = new PriorityQueue((operation1, operation2) => {
            return operation1.getPriority() - operation2.getPriority(); //return the differences in priorities
        });

        this.operationResults = {}; //the operation results are {operationId:result}

  
    }

  


    /**
     * enqueues an operation onto the operation queue
     * @param {*} operation 
     * @returns the id of the operation for return calls and checking if finished 
     */
    enqueueOperation(operation){   
        //generate a new id
        var id = this._getNewOperationId();
        operation.setId(id);
        this.operationResults[id] = "waiting";
        this.operationQueue.enqueue(operation);
        this._processNextOperation();
    }


    /**
     * processes the next operation
     */
    async _processNextOperation(){
        if(this.currentOperation !== false || this.operationQueue.size() == 0){
            return;
        }

        var operation = this.operationQueue.dequeue();
        this.currentOperation = operation;
        this.operationResults[operation.getId()] = await operation.execute(this);


        if(this.operationQueue.size() == 0){
            this.currentOperation = false;
            return;
        }

        this._processNextOperation();
        




    }


    /**
     * 
     * @param {*} id 
     * @returns the result of a database operation with the given id. will delete the result once finished
     */
    getOperationResult(id){
        if(!this.isOperationFinished(id)){
            return;
        }
        var result = this.operationResults[id];
        delete this.operationResults[id];
        return result;

    }

    /**
     * 
     * @param {*} id 
     * @returns true if the operation has finished
     */
    isOperationFinished(id){
        return this.operationResults[id] == "waiting";
    }



    /**
     * @returns a new operation id not being used by another operation
     */
    _getNewOperationId(){
        var newOppId = helpers.getRandomInt(99999);
        while(this.operationResults.hasOwnProperty(newOppId)){
            newOppId = helpers.getRandomInt(99999);
        }

        return newOppId;
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
        //summary - a summary of the task
        //username - username belonging to the user who owns the task
        //date - date of the task in the format mm/dd/yyyy
        //location - the location of the task in the worl
        //startTime - the start time of the task. in the format hh:mm
        //endTime - the end time of the task. in the format hh:mm
        //rescursiveId - an id shared by all tasks which are linked or -1 if individual
        await db.run("CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY UNIQUE,  username TEXT, summary TEXT, location TEXT, date TEXT, startTime TEXT, endTime TEXT, recursiveId INTEGER , FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)");

        //ratedTask
        //a rated task is added data for a task. contains data about how the task was performed.
        //taskId - id belonging to the individual task. references the tasks table
        //enjoyment - how much the user enjoyed the tasks. scale 1-5. 5 being greatest
        //physicalActivity - how physically active the user was. scale 1-5. 5 being greatest
        //engagement - how engaged the user was mentally. scale 1-5. 5 being greatest
        //mentalDifficulty - how mentally difficult the task was. scale 1-5. 5 being greatest
        await db.run("CREATE TABLE IF NOT EXISTS ratedTasks (taskId INTEGER  PRIMARY KEY UNIQUE, enjoyment INTEGER , phyiscalActivity INTEGER , engagement INTEGER , mentalDifficulty INTEGER , FOREIGN KEY(taskId) REFERENCES tasks(taskId) ON DELETE CASCADE)");

        //daily
        //a rating of individual days for users
        //date - date of the day in the format mm/dd/yyyy
        //time - epoch time when the rating was done
        //username - the user which the day belongs to. linked to the users table
        //happiness - a happiness value associated with the whole day. scale 1-5. 5 being greated
        //rating - a general summary rating for the day made from pre-existing data. floating point number from 0-1;
        await db.run("CREATE TABLE IF NOT EXISTS daily (date TEXT, time TEXT, username TEXT, happiness INTEGER , rating REAL, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, PRIMARY KEY(date, username))");


        //api keys
        //maps a username to it's current api key
        //username - the username the api key belongs to
        //key - a string of letters and numbers which makes up the api key
        //date - the date the key was issued in the format mm/dd/yyyy
        await db.run("CREATE TABLE IF NOT EXISTS apiCredentials (username TEXT PRIMARY KEY, key TEXT, date TEXT, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)")

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
    async exec(statement, params) {
        try {
            var db = await this._getDBConnection();
            await db.run(statement, params);
            await db.close();
        }
        catch (e) {
            console.log("database handler unable to execute run \"" + statement + "\"");
            console.log("Params: " + params);
            console.log(e);
        }
    }



    /**
     * queries the database with a given query
     * @param {*} statement statement to query db with
     * @returns response from the database
     */
    async query(statement, params) {
        let response;
        try {
            var db = await this._getDBConnection();
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

    /**
     * debug methods
     */

    async _DEBUG_wipeTasks() {
        await this.exec("DROP TABLE tasks");
        await this.exec("DROP TABLE ratedTasks");
    }

    async _DEBUG_wipeDailys() {
        await this.exec("DROP TABLE daily");
    }
}