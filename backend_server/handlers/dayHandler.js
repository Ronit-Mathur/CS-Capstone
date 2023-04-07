const DatabaseHandler = require("./databaseHandler");
const helpers = require("../lib/helpers");
const Statement =require("./database/statement");
const Query = require("./database/query");

module.exports = class dayHandler {
    static current

    constructor() {
        dayHandler.current = this;
    }


    /**
     * rates a specific day for a user
     * @param {*} username username of the user
     * @param {*} date mm/dd/yyyy
     * @param {*} time the time the rating was done in epoch format
     * @param {*} happiness happiness value from 1-5. 5 being greated
     */
    async rateDay(username, date, happiness, time){
        if(!helpers.isDateFormat(date)){
            //invalid date format
            return false;
        }

        //check that day hasn't already been rated by the user
        if(await this._dateRated(username, date)){
            return false;
        }

        var rating = -1; //set a rating of -1 TODO
        var s = new Statement(2, "INSERT INTO daily (date,username,happiness,rating, time) VALUES (?,?,?,?,?)", [date,username,happiness, rating, time]);
        DatabaseHandler.current.enqueueOperation(s);
        //await DatabaseHandler.current.exec("INSERT INTO daily (date,username,happiness,rating, time) VALUES (?,?,?,?,?)", [date,username,happiness, rating, time]);
        return true;
    }


    /**
     * 
     * @param {*} username 
     * @param {*} date 
     * @returns a daily object or null if the day has not been rated
     */
    async getDaily(username, date){
        var q = new Query(1, "SELECT * FROM daily WHERE username = ? AND date = ?", [username, date]);
        var oppID = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppID);

        //var result = await DatabaseHandler.current.query("SELECT * FROM daily WHERE username = ? && date = ?", [username, date]);
        if(result.length > 0){
            return result[0];
        }
        else{
            return null;
        }
    }


    /**
     * 
     * @param {*} username 
     * @param {*} date 
     * @returns true if the date has already been rated by the user
     */
    async _dateRated(username, date){
        var q = new Query(1, "SELECT * FROM daily WHERE username = ? AND date = ?",[username, date]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var result = await DatabaseHandler.current.query("SELECT * FROM daily WHERE username = ? AND date = ?",[username, date]);
        return result.length > 0;
    }
}