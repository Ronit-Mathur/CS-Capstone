/**
 * wrapper functions for user interactions with the server
 */

const serverConstants = require("../../backend_server/serverConstants");
const { default: serverHandler } = require("./serverHandler");


/**
 * creates a user on the server. 
 * @returns if the user was succesfully created
 */
async function createUser(username, password, email) {
    try {
        const resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_CREATE, { username: username, password: password, email: email });

    }
    catch (e) {

        //error creating user. not succesfully created
        return false;
    }
    return true;
}


/**
 * 
 * @param {*} username 
 * @returns true if a user with the given username exists
 */
async function userExists(username) {
    var resp;
    try {
        resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_EXISTS, { username: username });

    }
    catch (e) {

        //error creating user. not succesfully created
        return false;
    }
    return resp === "true";
} 