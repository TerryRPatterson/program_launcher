import electron from "electron";
import path from "path";
import url from "url";
import isDevelopment from "electron-is-dev";

import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from
    "electron-devtools-installer";



const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


let pluginName = "flash-plugin";
let pluginLocation = path.join(__dirname, pluginName);

app.commandLine.appendSwitch("ppapi-flash-path", pluginLocation);

let mainWindow;

const createWindow = () => {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));

    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar:true,
        webPreferences: {
            plugins: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    // if (isDevelopment) {
    //     mainWindow.webContents.openDevTools();
    // }


    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    app.quit();
});
