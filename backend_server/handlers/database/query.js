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



    /**
     * executes the query on the given databasehandler
     * @param {*} databaseHandler 
     * @returns returns the result to the query
     */
    async execute(){
        return await DatabaseHandler.current.query(this.statement, this.params);
    }
}