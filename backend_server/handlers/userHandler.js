const DatabaseHandler = require("./databaseHandler")
const bcrypt = require("bcrypt");
const { getOutlookEventsFromToken, getOutlookCalendarsFromToken, getOutlookOAuth2Token, getAuthorizedGoogleOAuth2Client, getGoogleCalendarsFromClient, getGoogleEventsFromClient } = require("../lib/external_integration/calendarImports");
const Server = require("../server");
const crypto = require("crypto");
const helpers = require("../lib/helpers");
const Query = require("./database/query");
const { Statement } = require("sqlite");

/**
 * handles user operations. this includes interacting with the database. initialize database before creating or using
 */
module.exports = class UserHandler {
    static current;


    constructor() {
        UserHandler.current = this;
        //credentials are used to authenticate with google and microsoft servers. only stored in memory
        //ip:key
        this.googleOAuthCredentials = {};
        this.outlookOAuthCredentials = {};

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
     * @returns the api key for the specific user or -1. if user is not valid
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

        return key;
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
     * @returns the user associated with the given username or null if the user dosen't exist
     */
    async _getUser(username) {
        var q = new Query(1, "SELECT * FROM users WHERE username = ?", [username]);
        var oppId = DatabaseHandler.current.enqueueOperation(q);
        var users = await Database.current.waitForOperationToFinish(oppId);
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
    * @param {*} ip ip of the user whos authenticating
    * @param {*} key key generated by outlook servers
    */
    async completeOutlookAuthentication(ip, key) {
        //swap for a token and store it in memory for accessing laters
        var token = await getOutlookOAuth2Token(key);
        this.outlookOAuthCredentials[ip] = token;
    }

    /**
     * completes the google authentication process
     * @param {*} ip ip of the user whos authenticating
     * @param {*} key key generated by google servers
     */
    async completeGoogleAuthentication(ip, key) {
        //create a client from the key and store it in memory for accessing laters
        const client = await getAuthorizedGoogleOAuth2Client(key);
        this.googleOAuthCredentials[ip] = client;
    }


    hasOutlookAuthentication(ip) {
        return this.outlookOAuthCredentials[ip] != null;
    }

    async getOutlookCalendars(ip) {
        const token = this.outlookOAuthCredentials[ip];
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
     * @param {*} ip ip to clear
     */
    clearGoogleAuthentication(ip) {
        delete this.googleOAuthCredentials[ip];
    }

    /**
     * 
     * @param {*} ip ip of the user
     * @return true if there is an authenticated client stored for the user
     */
    hasGoogleAuthentication(ip) {
        return this.googleOAuthCredentials[ip] != null;
    }

    /**
     * gets a users calendars from the google servers. must have oauthed first
     * @param {*} ip ip of the user
     * @returns a list of google calendars associated with the ip
     */
    async getGoogleCalendars(ip) {
        const client = this.googleOAuthCredentials[ip];
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
    async importGoogleCalendar(id, ip, username) {
        const client = this.googleOAuthCredentials[ip];
        if (!client || (!await this.userExists(username))) {
            return [];
        }



        const events = await getGoogleEventsFromClient(client, id);


        //hand off events to task handler to parse
        await Server.current.getTaskHandler().parseAndImportGoogleEvents(events, username);

    }



    /**
     * imports a users outlook calendar into the database
     * @param {*} id id of the calendar to import
     */
    async importOutlookCalendar(id, ip, username) {
        const token = this.outlookOAuthCredentials[ip];
        if (!token || (!await this.userExists(username))) {
            return [];
        }



        const events = await getOutlookEventsFromToken(token, id);

        //hand off events to task handler to parse
        await Server.current.getTaskHandler().parseAndImportOutlookEvents(events, username);
    }
}







