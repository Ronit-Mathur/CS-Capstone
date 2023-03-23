const DatabaseHandler = require("./databaseHandler");
const helpers = require("../lib/helpers");

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

        var rating = -1; //set a rating of -1 TODO
        await DatabaseHandler.current.exec("INSERT INTO daily (date,username,happiness,rating, time) VALUES (?,?,?,?,?)", [date,username,happiness, rating, time]);
        return true;
    }
}