const DatabaseHandler = require("./databaseHandler")
const bcrypt = require("bcrypt");
const { getAuthorizedGoogleOAuth2Client, getGoogleCalendarsFromClient, getGoogleEventsFromClient } = require("../lib/external_integration/calendarImports");
const Server = require("../server");

/**
 * handles user operations. this includes interacting with the database. initialize database before creating or using
 */
module.exports = class UserHandler {



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
    async createUser(username, email, password) {
        if (await this.userExists(username)) {
            return false; //user already exists, do not add to db
        }

        var hashedPassword = await this._hash(password);

        //perform insertion statement
        await DatabaseHandler.current.exec("INSERT INTO users (username, email, password) VALUES(?,?,?)", [username, email, hashedPassword]);
        return true;
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
}







