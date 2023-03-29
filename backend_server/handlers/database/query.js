const DatabaseHandler = require("../databaseHandler");
const Operation = require("./operation");

module.exports = class Query extends Operation{
    /**
     * a query is an sql statement with a return
     */


      /**
     * 
     * @param {*} priority the priority of the statement. an integer 1 being urgent
     * @param {*} statement the string statement to be executed in the database
     * @param {*} params a list of parameters for the statement
     */
    constructor(priority, statement, params){
        super(priority);

        this.statement = statement;
        this.params = params;
    }


    getStatement(){
        return this.statement;
    }

    getParams(){
        return this.params;
    }
}