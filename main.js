"use strict";
import electron from "electron";
import path from "path";
import url from "url";
import {homedir} from "os";

import isDevelopment from "electron-is-dev";

import startLogging from "./lib/logging";

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from
    "electron-devtools-installer";


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


const pluginName = "flash-plugin";
const pluginLocation = path.join(__dirname, pluginName);

app.commandLine.appendSwitch("ppapi-flash-path", pluginLocation);

let mainWindow;

const createWindow = () => {
    if (isDevelopment) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log("An error occurred: ", err));

        installExtension(REDUX_DEVTOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log("An error occurred: ", err));
    }
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            plugins: true,
        },
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    // if (isDevelopment) {
    //     mainWindow.webContents.openDevTools();
    // }


    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.webContents.on("new-window",
        (
            event,
            url,
            frameName,
            dispostion,
            options
        ) => {
            console.log(`Caught Window ${frameName}`);
            event.preventDefault();
            const newOptions = {
                ...options,
                show: false,
                autoHideMenuBar: true,
                title: frameName,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                },
            };
            const win = new BrowserWindow(newOptions);
            win.once("ready-to-show", () => win.show());
            win.loadURL(url);
            startLogging(win.webContents, `${homedir()}/gameLogs`, frameName);
            event.newGuest = win;
        });

    startLogging(mainWindow.webContents);
};


app.on("ready", createWindow);

app.on("window-all-closed", () => {
    app.quit();
});
