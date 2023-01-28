/**
 * Root of mental health tracker remote server project
 * @author Owen Russell-Lanning, Kyler Greenway, Ronit Mathur
 */


const Server = new (require("./backend_server/server.js"))();
console.log("[Index] Mental Health Tracker Remote Server is Running");