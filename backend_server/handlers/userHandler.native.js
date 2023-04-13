const DatabaseHandler = require("./databaseHandler")
//const bcrypt = require("bcrypt");
//const { getOutlookEventsFromToken, getOutlookCalendarsFromToken, getOutlookOAuth2Token, getAuthorizedGoogleOAuth2Client, getGoogleCalendarsFromClient, getGoogleEventsFromClient } = require("../lib/external_integration/calendarImports");
const helpers = require("../lib/helpers");
const Query = require("./database/query");
const Statement = require("./database/statement");


/**
 * handles user operations. this includes interacting with the database. initialize database before creating or using
 */
module.exports = class UserHandler {
    static current;


    constructor() {

        console.log("starting");
        UserHandler.current = this;
        //credentials are used to authenticate with google and microsoft servers. only stored in memory
        //username:key
        this.googleOAuthCredentials = {};
        this.outlookOAuthCredentials = {};
        this.ipToUsername = {}; //a simple map of username to ip

    }


    /**
     * checks if a user exists in the database
     * @param {*} username username of user to lookup
     * @return {boolean} true if user exists
     */
    async userExists(username) {
        var q = new Query(1, "SELECT * FROM users WHERE username = ?", [username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var dbResult = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var dbResult = await DatabaseHandler.current.query("SELECT * FROM users WHERE username = ?", [username]);
        return dbResult.length != 0;
    }


    /**
     * adds a user to the database
     * @param {*} username username of new user
     * @param {*} email email address of new user
     * @param {*} password password new user. will be hasheds
     * @return true if user was added to the database or false if not
     */
    async createUser(username, email, password) {
        if (await this.userExists(username)) {
            return false; //user already exists, do not add to db
        }

        var hashedPassword = await this._hash(password);

        //perform insertion statement
        var statement = new Statement(1, "INSERT INTO users (username, email, password) VALUES(?,?,?)", [username, email, hashedPassword]);
        var oppId = DatabaseHandler.current.enqueueOperation(statement);
        await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //await DatabaseHandler.current.exec("INSERT INTO users (username, email, password) VALUES(?,?,?)", [username, email, hashedPassword]);
        return true;
    }


    /**
     * checks if a login is valid. a.k.a the username and password match
     * @param {*} username 
     * @param {*} password 
     * @returns the [api key, session token] for the specific user or -1. if user is not valid
     */
    async isValidLogin(username, password) {
        if (!await this.userExists(username)) {
            return -1;
        }

        var user = await this._getUser(username);
        if (!await this._equalsHash(password, user.password)) {
            return -1;
        }


        //user is valid.
        //generate a new api key for the user and store it in the database
        var key = await this._generateAndStoreApiKey(username);
        var token = await this._generateAndStoreSessionToken(username);
        return [key, token];
    }
    /**
   * checks if a session login is valid. a.k.a the username and session token match. if true, a new session token is generated
   * @param {*} username 
   * @param {*} sessionToken 
   * @returns the [api key, session token] for the specific user or -1. if user is not valid
   */
    async isValidSessionLogin(username, sessionToken) {
        if (!await this.userExists(username)) {
            return -1;
        }

        var currentToken = await this._getSessionToken(username);
        if (currentToken && currentToken.token != sessionToken) {
            return -1;
        }


        //user is valid.
        //generate a new api key for the user and store it in the database
        var key = await this._generateAndStoreApiKey(username);
        var token = await this._generateAndStoreSessionToken(username);
        return [key, token];
    }


    /**
     * generates a new api key for the user and stores it in the database
     * @param {*} username 
     * @returns the new api key or -1 if failed
     */
    async _generateAndStoreApiKey(username) {

        //make sure user exists
        if (!await this.userExists(username)) {
            console.log("[userHandler] unable to generate new api key for user \"" + username + "\". user does not exist");
            return -1;
        }

        //var crypto = null;
        try {
         //   let c = "crypto";
          //  crypto = (await import(c)).default;
        }
        catch(e) {

        }

        var key = crypto.randomBytes(20).toString('hex');
        var today = helpers.getTodaysDate();


        //check if user exists in the api database
        var currentKeyData = await this._getApiKey(username);
        let statement;
        //store new key into database
        if (currentKeyData === null) {
            //insert into api table
            statement = new Statement(1, "INSERT INTO apiCredentials (username, key, date) VALUES (?,?,?)", [username, key, today]);
            //await DatabaseHandler.current.exec("INSERT INTO apiCredentials (username, key, date) VALUES (?,?,?)", [username, key, today]);
        }
        else {
            //update table
            statement = new Statement(1, "UPDATE apiCredentials SET key = ?, date = ? WHERE username = ?", [key, today, username]);
            //await DatabaseHandler.current.exec("UPDATE apiCredentials SET key = ?, date = ? WHERE username = ?", [key, today, username]);
        }

        DatabaseHandler.current.enqueueOperation(statement);



        return key;
    }


    async _generateAndStoreSessionToken(username) {

        //make sure user exists
        if (!await this.userExists(username)) {
            console.log("[userHandler] unable to generate new session key for user \"" + username + "\". user does not exist");
            return -1;
        }

        var crypto = null;
        try {
         //   let c = "crypto";
          //  crypto  = (await import(c)).default;
            var token = crypto.randomBytes(20).toString('hex');
        }
        catch(e){

        }



        //check if user exists in the api database
        var currentKeyData = await this._getSessionToken(username);
        let statement;
        //store new key into database
        if (currentKeyData === null) {
            //insert into api table
            statement = new Statement(1, "INSERT INTO sessionTokens (username, token) VALUES (?,?)", [username, token]);

        }
        else {
            //update table
            statement = new Statement(1, "UPDATE sessionTokens SET token = ? WHERE username = ?", [token, username]);

        }

        DatabaseHandler.current.enqueueOperation(statement);


        return token;

    }

    /**
     * 
     * @param {*} username 
     * @returns the current {username, api key, date} belonging to the user or null if the user dosen't have one
     */
    async _getApiKey(username) {

        var result = [];

        try {
            var q = new Query(1, "SELECT * FROM apiCredentials WHERE username = ?", [username]);
            var oppId = DatabaseHandler.current.enqueueOperation(q);
            result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
            //result = await DatabaseHandler.current.query("SELECT * FROM apiCredentials WHERE username = ?", [username]);
        }
        catch (e) {
            console.log("[userHandler] error retreiving api key from db for \"" + username + "\"");
        }

        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }

    }


    /**
     * 
     * @param {*} username 
     * @returns the current {username, session token, date} belonging to the user or null if the user dosen't have one
     */
    async _getSessionToken(username) {
        var result = [];

        try {
            var q = new Query(1, "SELECT * FROM sessionTokens WHERE username = ?", [username]);
            var oppId = DatabaseHandler.current.enqueueOperation(q);
            result = await DatabaseHandler.current.waitForOperationToFinish(oppId);
            //result = await DatabaseHandler.current.query("SELECT * FROM apiCredentials WHERE username = ?", [username]);
        }
        catch (e) {
            console.log("[userHandler] error retreiving session token from db for \"" + username + "\"");
        }

        if (result.length > 0) {
            return result[0];
        }
        else {
            return null;
        }

    }

    /**
     * 
     * @param {*} username
     * @returns the user associated with the given username or null if the user dosen't exist
     */
    async _getUser(username) {
        var q = new Query(1, "SELECT * FROM users WHERE username = ?", [username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var users = await DatabaseHandler.current.waitForOperationToFinish(oppId);
        //var users = await DatabaseHandler.current.query("SELECT * FROM users WHERE username = ?", [username]);
        if (users && users.length > 0) {
            return users[0];
        }

        return null;
    }


    /**
     * hashes a text and returns the hashed value
     * @param {*} text text to hash
     * @returns the hashed value
     */
    async _hash(text) {
        const saltRounds = 10; //amount of times to salt the text
        var salt = await bcrypt.genSalt(saltRounds);
        var hash = bcrypt.hash(text, salt);
        return hash;
    }




    /**
     * checks to see if a user has the correct authentication key
     * @param {*} username username api key belongs to
     * @param {*} apiKey api key of the user
     * @returns true if the api key is a valid authentication key
     */
    async authenthicate(username, apiKey) {
        if (!await this.userExists(username)) {
            return false;
        }

        var apiInfo = await this._getApiKey(username);
        return apiInfo.key == apiKey.trim();
    }

    /**
     * checks if a hash and text value are equal
     * @param {*} text 
     * @param {*} hash 
     * @retruns true if the hashed value is equal to the text
     */
    async _equalsHash(text, hash) {
        return await bcrypt.compare(text, hash);
    }

    /**
    * completes the outlook authentication process
    * @param {*} username username of the user whos authenticating
    * @param {*} key key generated by outlook servers
    */
    async completeOutlookAuthentication(ip, key) {
        //swap for a token and store it in memory for accessing laters
        var token = await getOutlookOAuth2Token(key);

        //swap the ip with the username
        var username = this.ipToUsername[ip];
        this._clearUsernameFromIp(ip);

        this.outlookOAuthCredentials[username] = token;
    }

    storeUsernameUnderIp(username, ip) {
        this.ipToUsername[ip] = username;
    }

    _clearUsernameFromIp(ip) {
        delete this.ipToUsername[ip];
    }

    /**
     * completes the google authentication process
     * @param {*} ip ip of the user whos authenticating
     * @param {*} key key generated by google servers
     */
    async completeGoogleAuthentication(ip, key) {
        //create a client from the key and store it in memory for accessing laters
        const client = await getAuthorizedGoogleOAuth2Client(key);

        //swap the ip with the username
        var username = this.ipToUsername[ip];
        this._clearUsernameFromIp(ip);


        this.googleOAuthCredentials[username] = client;
    }


    hasOutlookAuthentication(username) {
        return this.outlookOAuthCredentials[username] != null;
    }

    async getOutlookCalendars(username) {
        const token = this.outlookOAuthCredentials[username];
        if (!token) {
            return [];
        }
        const calendarObjs = await getOutlookCalendarsFromToken(token);

        var simpleCalendars = [];
        //return only the calendars summary and id
        calendarObjs.map((obj) => {
            simpleCalendars.push({ id: obj.id, name: obj.name });
        })
        return simpleCalendars;
    }


    /**
     * clears a user's current google authentication from memory
     * @param {*} username username to clear
     */
    clearGoogleAuthentication(username) {
        delete this.googleOAuthCredentials[username];
    }

    /**
     * 
     * @param {*} username username of the user
     * @return true if there is an authenticated client stored for the user
     */
    hasGoogleAuthentication(username) {
        return this.googleOAuthCredentials[username] != null;
    }

    /**
     * gets a users calendars from the google servers. must have oauthed first
     * @param {*} ip ip of the user
     * @returns a list of google calendars associated with the ip
     */
    async getGoogleCalendars(username) {
        const client = this.googleOAuthCredentials[username];
        if (!client) {
            return [];
        }
        const calendarObjs = await getGoogleCalendarsFromClient(client);
        var simpleCalendars = [];
        //return only the calendars summary and id
        calendarObjs.map((obj) => {
            simpleCalendars.push({ id: obj.id, name: obj.summary });
        })
        return simpleCalendars;
    }


    /**
     * imports a users google calendar into the database
     * @param {*} id id of the calendar to import
     */
    async importGoogleCalendar(id, username) {
        const client = this.googleOAuthCredentials[username];
        if (!client || (!await this.userExists(username))) {
            return [];
        }



        const events = await getGoogleEventsFromClient(client, id);


        //hand off events to task handler to parse
        //const Server = require("../server");
        //await Server.current.getTaskHandler().parseAndImportGoogleEvents(events, username);

    }



    /**
     * imports a users outlook calendar into the database
     * @param {*} id id of the calendar to import
     */
    async importOutlookCalendar(id, username) {
        const token = this.outlookOAuthCredentials[username];
        if (!token || (!await this.userExists(username))) {
            return [];
        }



        const events = await getOutlookEventsFromToken(token, id);

        //hand off events to task handler to parse
       // const Server = require("../server");
        //await Server.current.getTaskHandler().parseAndImportOutlookEvents(events, username);
    }

    /**
     * 
     * @param {*} username 
     * @returns the users info
     */
    async getUserInfo(username) {
        var q = new Query(1, "SELECT username,email FROM users WHERE username = ?", [username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        var result = await DatabaseHandler.current.waitForOperationToFinish(id);
        return result[0];
    }


    /**
     * deletes the user from the database
     * @param {*} username 
     */
    async deleteUser(username) {
        var q = new Query(1, "DELETE from users WHERE username = ? ", [username]);
        var id = DatabaseHandler.current.enqueueOperation(q);
        return;
    }



}







