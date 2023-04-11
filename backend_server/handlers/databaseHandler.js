/**
 * handles sqlite database INTEGER eraction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../serverConstants");
const PriorityQueue = require('priority-queue-node')
const helpers = require("../lib/helpers");
const Query = require("./database/query");
const Statement = require("./database/statement");



module.exports = class DatabaseHandler {

    static current; //current database handler being used by the server

    currentOperation = false; //the current operation being processed






    /**
     * 
     * @param {boolean} isRemote whether or not the database is remote
     */
    constructor(isRemote, dbWrapper) {
        DatabaseHandler.current = this;
        this.isRemote = isRemote;
        this.dbWrapper = dbWrapper;




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
    enqueueOperation(operation) {
        //generate a new id
        var id = this._getNewOperationId();
        operation.setId(id);
        this.operationResults[id] = "waiting";
        this.operationQueue.enqueue(operation);
        this._processNextOperation();
        return id;
    }

    /**
     * waits for a specific tasks to finish
     * @param {*} id task id
     * @return the result of the task
     */
    async waitForOperationToFinish(id) {
        while (!DatabaseHandler.current.isOperationFinished(id)) {
            await helpers.sleep(300);
        }

        return DatabaseHandler.current.getOperationResult(id);
    }

    /**
     * processes the next operation
     */
    async _processNextOperation() {
        if (this.currentOperation !== false || this.operationQueue.size() == 0) {
            return;
        }

        var operation = this.operationQueue.dequeue();
        this.currentOperation = operation;
        var statement = operation.getStatement();
        var params = operation.getParams();
        var result = "finished";

        try {
            if (operation instanceof Query) {

                result = await this.query(statement, params);
            }
            else if (operation instanceof Statement) {
                await this.exec(statement, params);
            }
        } catch (e) {
            console.log("[DatabaseHandler] Unable to process next operation");
            console.log(e);
            result = "error";
        }

        this.operationResults[operation.getId()] = result;


        if (this.operationQueue.size() == 0) {
            this.currentOperation = false;
            return;
        }

        this.currentOperation = false;

        this._processNextOperation();





    }


    /**
     * 
     * @param {*} id 
     * @returns the result of a database operation with the given id. will delete the result once finished
     */
    getOperationResult(id) {
        if (!this.isOperationFinished(id)) {
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
    isOperationFinished(id) {
        return this.operationResults[id] != "waiting";
    }



    /**
     * @returns a new operation id not being used by another operation
     */
    _getNewOperationId() {
        var newOppId = helpers.getRandomInt(99999);
        while (this.operationResults.hasOwnProperty(newOppId)) {
            newOppId = helpers.getRandomInt(99999);
        }

        return newOppId;
    }

    /**
     * @summary initializes the database. will not overwrite any data. run each time when handler is started
     */
    async _initDatabase() {



        //create tables if not exist

        //user table is needed even if not remote. cascade delete
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY UNIQUE, email TEXT UNIQUE, password TEXT)", []);



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
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS tasks (taskId INTEGER PRIMARY KEY UNIQUE,  username TEXT, summary TEXT, location TEXT, date TEXT, startTime TEXT, endTime TEXT, recursiveId INTEGER , FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)",[]);

        //ratedTask
        //a rated task is added data for a task. contains data about how the task was performed.
        //taskId - id belonging to the individual task. references the tasks table
        //enjoyment - how much the user enjoyed the tasks. scale 1-5. 5 being greatest
        //physicalActivity - how physically active the user was. scale 1-5. 5 being greatest
        //engagement - how engaged the user was mentally. scale 1-5. 5 being greatest
        //mentalDifficulty - how mentally difficult the task was. scale 1-5. 5 being greatest
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS ratedTasks (taskId INTEGER  PRIMARY KEY UNIQUE, enjoyment INTEGER , phyiscalActivity INTEGER , engagement INTEGER , mentalDifficulty INTEGER , FOREIGN KEY(taskId) REFERENCES tasks(taskId) ON DELETE CASCADE)",[]);

        //daily
        //a rating of individual days for users
        //date - date of the day in the format mm/dd/yyyy
        //time - epoch time when the rating was done
        //username - the user which the day belongs to. linked to the users table
        //happiness - a happiness value associated with the whole day. scale 1-5. 5 being greated
        //rating - a general summary rating for the day made from pre-existing data. floating point number from 0-1;
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS daily (date TEXT, time TEXT, username TEXT, happiness INTEGER , rating REAL, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE, PRIMARY KEY(date, username))",[]);


        //api keys
        //maps a username to it's current api key
        //username - the username the api key belongs to
        //key - a string of letters and numbers which makes up the api key
        //date - the date the key was issued in the format mm/dd/yyyy
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS apiCredentials (username TEXT PRIMARY KEY, key TEXT, date TEXT, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)",[]);


        //session tokens
        //maps a username to it's current session token
        //username - the username the session token belongs to
        //token - the session token of the user. a string of letters and numbers
        await this.dbWrapper.exec("CREATE TABLE IF NOT EXISTS sessionTokens (username TEXT PRIMARY KEY, token TEXT, FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE)",[]);

    }


   

    /**
     * executes an sql statement on the datbase with no return
     * @param {*} statement statement to execute
     */
    async exec(statement, params) {
        await this.dbWrapper.exec(statement, params);
    }



    /**
     * queries the database with a given query
     * @param {*} statement statement to query db with
     * @returns response from the database
     */
    async query(statement, params) {
       return await this.dbWrapper.query(statement, params);
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