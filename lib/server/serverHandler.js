/**
 * handles communication with the server
 */

const path = require('path');

export default class serverHandler{


    static current;

    /**
     * 
     * @param {*} ip the ip of the server
     * @param {*} port the port of the server
     */
    constructor(ip, port){
        this.ip = ip;
        this.port = port;
        serverHandler.current = this;
    }


    /**
     * gets from the server with the given params and endpoint
     * @param {*} endpoint 
     * @param {*} params 
     * @returns the json value at the endpoint
     */
    async fetchGet(endpoint, params){
        const fullUri = path.join(this.ip + ":" + this.port, endpoint) + "?"; //craft the full endpoint to give to the server
        const fResult = await fetch(fullUri + new URLSearchParams(params)); //fetch and wait for the result
        return await fResult.json(); //craft the endpoint
    }
}