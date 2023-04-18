/**
 * wrapper functions for user interactions with the server
 */

const serverConstants = require("../../backend_server/serverConstants");
const { default: serverHandler } = require("./serverHandler");
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalDatabaseWrapper from '../../backend_server/handlers/database/localDatabaseWrapper.js';
import DatabaseHandler from '../../backend_server/handlers/databaseHandler';
import DayHandler from '../../backend_server/handlers/dayHandler.js';
import TaskHandler from '../../backend_server/handlers/taskHandler.js';
import UserHandler from '../../backend_server/handlers/userHandler.native.js';
import { GetUserPhoto } from '../../components/external_integration/importUserPhoto';

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


/**
 * logins in a user to the server and store's the api key in the local data
 * @param {*} username username to login as
 * @param {*} password password of the user
 * @returns true if the login suceeded. false if failed
 */
async function loginUser(username, password) {

    var resp;
    try {
        resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_LOGIN, { username: username, password: password });

    }
    catch (e) {
        console.log("[loginUser] Unable to Login");
        console.log(e);
        //error logging in user
        return false;
    }

    if (resp != -1 && resp != -2) {
        //save username and api key into credentials
        serverHandler.current.userState = { username: username, auth: resp[0], sessionToken: resp[1] }

        //save the session token and username in the local storage
        await AsyncStorage.setItem("sessionToken", resp[1]);

        await AsyncStorage.setItem("username", username);
        await cacheUserInfo();
        return true;
    }
    else{
        return false;
    }



}


/**
 * tries to log the user in using the stored session variables
 */
async function loginUserSession(callback) {
    var token = await AsyncStorage.getItem("sessionToken");
    var username = await AsyncStorage.getItem("username");
    if (!token || !username) {
        callback(false, "");
    }
    var resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_SESSION_LOGIN, { username: username, sessionToken: token });
    if (resp != "-1") {
        //save username and api key into credentials
        serverHandler.current.userState = { username: username, auth: resp[0], sessionToken: resp[1] }

        //save the session token and username in the local storage

        await AsyncStorage.setItem("sessionToken", resp[1]);

        await AsyncStorage.setItem("username", username);
        await cacheUserInfo();
    }


    callback(resp != "-1", username);

}


/**
 * gets the user's profile data from the server and caches it
 */
async function cacheUserInfo() {
    var resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_INFO, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
    serverHandler.current.userState.email = resp.email;
}


async function logout() {

    await new Promise(function (resolve, reject) {
        GetUserPhoto(async (base64) => {
            var currentUser = serverHandler.current.userState.username;
            await AsyncStorage.clear();

            if (base64 != null) {
                await AsyncStorage.setItem(currentUser + "$photo", base64);
            }
            resolve();
        });
    });
   
}


async function deleteUser() {
    await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_DELETE, { username: serverHandler.current.userState.username, auth: serverHandler.current.userState.auth });
    await logout();
}

/**
 * sets up the app for local use
 */
async function initLocalUser() {

    if (serverHandler.current.userState != null && serverHandler.current.userState.localInitCompleted == true) {
        
        console.log("already inited");
        return;
    }

    await AsyncStorage.setItem("dataStorageMethod", "local");
    await AsyncStorage.setItem("username", "me");
    serverHandler.current.userState = {};
    serverHandler.current.userState.username = "me";
    serverHandler.current.userState.localInitCompleted = true;


    //init the local database handler
    var ldb = new LocalDatabaseWrapper();
    const dbHandler = new DatabaseHandler(false, ldb);
    await dbHandler.init();
    const userHandler = new UserHandler();
    const taskHandler = new TaskHandler();
    const dayHandler = new DayHandler();

}

async function isRemoteAsync() {
    var storageMethod = await AsyncStorage.getItem("dataStorageMethod");
    return storageMethod != "local";
}


async function isRemote(callback) {
    var storageMethod = await AsyncStorage.getItem("dataStorageMethod");
    callback(storageMethod != "local");
}

export { initLocalUser, createUser, userExists, loginUser, loginUserSession, logout, deleteUser, isRemote, isRemoteAsync }