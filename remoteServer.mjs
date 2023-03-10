/**
 * Root of mental health tracker remote server project
 * @author Owen Russell-Lanning, Kyler Greenway, Ronit Mathur
 */

import Server from "./backend_server/server.js";

async function main(){
    const server = new Server(true);
    console.log("[Index] Mental Health Tracker Remote Server is Running");
    await server.start();
}



await main();
