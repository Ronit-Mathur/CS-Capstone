/**
 * wrapper functions for user interactions with the server
 */

const serverConstants = require("../../backend_server/serverConstants");
const { default: serverHandler } = require("./serverHandler");
import AsyncStorage from '@react-native-async-storage/async-storage';

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
async function loginUser(username, password){
    
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
   
    if(resp != "-1"){
        //save username and api key into credentials
        serverHandler.current.userState = {username : username, auth : resp[0], sessionToken: resp[1]}

        //save the session token and username in the local storage
        await AsyncStorage.setItem("sessionToken", resp[1]);

        await AsyncStorage.setItem("username", username);   
    }

    return (resp != "-1");
}


/**
 * tries to log the user in using the stored session variables
 */
async function loginUserSession(callback){
    var token = await AsyncStorage.getItem("sessionToken");
    var username = await AsyncStorage.getItem("username");
    if(!token || !username){
        callback(false, "");
    }
    var resp = await serverHandler.current.fetchGet(serverConstants.SERVER_ENDPOINTS.USER_SESSION_LOGIN, { username: username, sessionToken: token });
    if(resp != "-1"){
        //save username and api key into credentials
        serverHandler.current.userState = {username : username, auth : resp[0], sessionToken: resp[1]}

        //save the session token and username in the local storage
   
        await AsyncStorage.setItem("sessionToken", resp[1]);
       
        await AsyncStorage.setItem("username", username);   
    }
  

    callback(resp != "-1", username);

}


export {createUser, userExists, loginUser, loginUserSession}