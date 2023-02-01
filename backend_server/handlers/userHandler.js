const DatabaseHandler = require("./databaseHandler")
const bcrypt = require("bcrypt")

/**
 * handles user operations. this includes interacting with the database. initialize database before creating or using
 */
module.exports = class UserHandler{
    constructor(){

    }


    /**
     * checks if a user exists in the database
     * @param {*} username username of user to lookup
     * @return {boolean} true if user exists
     */
    async userExists(username){
        var dbResult = await DatabaseHandler.current.query("SELECT * FROM users WHERE username = ?", [username]);
        return dbResult.length != 0; 
    }


    /**
     * adds a user to the database
     * @param {*} username username of new user
     * @param {*} email email address of new user
     * @param {*} password password new user. will be hasheds
     * @return true if user was added to the database or false if not
     */
    async createUser(username, email, password){
        //TODO Hash Password
        if(await this.userExists(username)){
            return false; //user already exists, do not add to db
        }

        var hashedPassword = await this._hash(password);

        //perform insertion statement
        await DatabaseHandler.current.exec("INSERT INTO users (username, email, password) VALUES(?,?,?)", [username,email,hashedPassword]);
        return true;
    }


    /**
     * hashes a text and returns the hashed value
     * @param {*} text text to hash
     * @returns the hashed value
     */
    async _hash(text){
        const saltRounds = 10; //amount of times to salt the text
        var salt = await bcrypt.genSalt(saltRounds);
        var hash = bcrypt.hash(text, salt);
        return hash;
    }


    /**
     * checks if a hash and text value are equal
     * @param {*} text 
     * @param {*} hash 
     * @retruns true if the hashed value is equal to the text
     */
    async _equalsHash(text, hash){
        return await  bcrypt.compare(text, hash);
    }

}