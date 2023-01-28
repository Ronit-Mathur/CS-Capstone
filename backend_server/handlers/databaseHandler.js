/**
 * handles sqlite database interaction. This includes creating and modifying the database
 */

const SERVER_CONSTANTS = require("../serverConstants");


module.exports = class DatabaseHandler{

    constructor(){
        this.initDatabase();
    }


    /**
     * @summary initializes the database. will not overwrite any data. run each time when handler is started
     */
    initDatabase(){
        
    }
}