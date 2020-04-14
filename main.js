// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
const Vue = require('vue');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // const icon = new Tray("img/logo.png");
    // Create the browser window.
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        show: false,
        frame: false,
        backgroundColor: "#373737",
        title: "MRS Launcher",
        // icon: icon
    });

    // and load the index.html of the app.
    mainWindow.loadFile('./loading.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.on('page-title-updated', function (event, title) {
    event.preventDefault()
});

let opts = {
    clientPackage: null,
    // For production launchers, I recommend not passing 
    // the getAuth function through the authorization field and instead
    // handling authentication outside before you initialize
    // MCLC so you can handle auth based errors and validation!
    authorization: Authenticator.getAuth("username", "password"),
    installer: "./minecraft",
    root: "./minecraft",
    version: {
        number: "1.12.2",
        type: "release"
    },
    memory: {
        max: "16000",
        min: "2000"
    }
}

var play = new Vue({ 
    el: "#btnPlay", 
    methods:{
      play: function () {
          launcher.launch(opts);
      }
    }
})