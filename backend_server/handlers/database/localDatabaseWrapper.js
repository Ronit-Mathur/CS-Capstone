const SQLite = require("react-native-sqlite-storage");

module.exports = class LocalDatabaseWrapper{
    constructor(){
        SQLite.enablePromise(true);
    }

    async getDBConnection(){
        return true;
    }
}