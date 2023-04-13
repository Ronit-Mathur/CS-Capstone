const SQLite = require("react-native-sqlite-storage");
const SERVER_CONSTANTS = require("../../serverConstants");

module.exports = class LocalDatabaseWrapper {
    constructor() {
        SQLite.enablePromise(true);
    }

    async getDBConnection() {
        return await new Promise(function (res, rej) {
            SQLite.openDatabase({ name: SERVER_CONSTANTS.DATABASE_FILE, location: 'default' }).then((DB) => {
                res(DB);
            });
        });
    }

    async exec(statement, params) {

        var connection = await this.getDBConnection();

        await (new Promise(function (res, rej) {
            connection.transaction((tx) => {
                tx.executeSql(statement, params).then(([tx, results]) => {
                    res();
                });
            });
        }));
    }

    async query(statement, params) {
        var connection = await this.getDBConnection();
        return await (new Promise(function (res, rej) {
            connection.transaction((tx) => {
                tx.executeSql(statement, params).then(([tx, results]) => {
                    if(results.rows == null){
                        return res([]);
                    };
                    return res(results.rows.raw());
                });
            });
        }));
    }
}