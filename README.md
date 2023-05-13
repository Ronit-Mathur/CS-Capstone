# CS-Capstone Optimood
 
Optimood had a client and a server. Instructions can be found below for how to implement both. The client can run as a local implementation with limited functionallity. The hard-coded server will be running until May 20th. After that it will be temporarily taken down as it is running on our personal network.
 
## Startup Instructions

### Client

#### Option 1
If you have an Android phone, you can download and install the apk from the releases section. 

#### Option 2
1. Install Node JS.
2. Clone the Dev branch.
3. Download the latest IOS and Android folders from the releases section. Place these in the root of the cloned directory.
4. In the root of the directory run `npm i --save-dev` to install dependencies.
5. If you want to run Optimood on a physical android device, enable USB Debugging on the phone and the plug it into your computer. If you want to use an emulator, you'll need to download and install Android Studio.
6. Run `npm start`

### Server
To start the remote server, clone the repository and in the root run:
```
npm run start-server
```
If you want to have this working with the app, the IP will need to be change in remoteServer.js and the fetch calls of the client. We do not reccomend this as some features will not work due to it not being linked to our domain.


## Developement Instructions
Download, clone or pull the Dev Branch\
Download the support files from the release branch and add them to the root directory of the project
