/**
 * handles sqlite database interaction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../serverConstants");


module.exports = class DatabaseHandler{

    constructor(){
        this.initDatabase(SERVER_CONSTANTS.DATABASE_FILE);
    }


    /**
     * @summary initializes the database. will not overwrite any data. run each time when handler is started
     * @param path the path of the sqlite database file or where to create one
     */
    initDatabase(path){

    }
}