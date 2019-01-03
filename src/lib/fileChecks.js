"use strict";
import fs from "fs";
import url from "url";
import childProcess from "child_process";
import path from "path";
import {homedir} from "os";
import moment from "moment";


const openLogFile = (
    fileURL,
    name,
    parentDirectories,
    outStream,
    errorStream) => {
    const fileNameTimestamp = moment().format("MMMM Do YYYY h");
    const fileNameSpaces = `${parentDirectories}-${name}-${fileNameTimestamp}`;
    const fileName = fileNameSpaces.replace(/ /g, "_");
    const logLocation = `${homedir()}/gameLogs/${fileName}`;
    const fileStream = fs.createWriteStream(logLocation, {flags: "a"});
    const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");

    fileStream.on("error", (error) => {
        if (error.code === "ENOENT") {
            fs.mkdir(`${homedir()}/gameLogs`, (error) => {
                if (error) {
                    throw error;
                } else {
                    openLogFile(fileURL, outStream, errorStream);
                }
            });
        } else {
            throw error;
        }
    });
    fileStream.write(`Program started ${timestamp} \n`);
    outStream.on("data", (data) => {
        const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        const message = `${timestamp} STDOUT: ${data}`;
        fileStream.write(message);
    });
    errorStream.on("data", (data) => {
        const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        const message = `${timestamp} STDERR: ${data}`;
        fileStream.write(message);
    });
};

const isExecutableCheck = ({fileStat}) => {
    const pUID = process.getuid();
    const pGIDs = process.getgroups();
    // create a comparison mask to see if anyone can execute the file
    let comparisionMask = fs.constants.S_IXOTH;
    // If the owner of the file is the executing user add the exectable user
    // constant to the comparison mask
    if (fileStat.uid === pUID) {
        comparisionMask = comparisionMask | fs.constants.S_IXUSR;
    }
    // If the group of the file is in the users groups add the exectable group
    // constant to the comparision mask
    if (pGIDs.includes(fileStat.gid)) {
        comparisionMask = comparisionMask | fs.constants.S_IXGRP;
    }
    // Bitwise and the comparison mask against the current mode
    //  if the return value is zero then the file is not exectuable
    const resultMask = fileStat.mode & comparisionMask;
    if (resultMask === 0) {
        return false;
    } else {
        return "Executable";
    }
};

const exectueProcess = (fileLocation, name, parentDirectories) => {
    const directory = path.dirname(fileLocation);
    process.chdir(directory);
    const child = childProcess.spawn(fileLocation);
    openLogFile(fileLocation, name, parentDirectories,
        child.stdout, child.stderr);
    child.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
};

export const isExecutable = {
    check: isExecutableCheck,
    execute: exectueProcess,
    display: "Exectuables",
    type: "Executable",
};

const isHTMLCheck = ({file}) => {
    if (file.endsWith(".html")) {
        return "HTML";
    } else {
        return false;
    }
};

const htmlExecute = (fileLocation, name, parentDirectories) => {
    const fullName = `${parentDirectories}-${name}`;
    const fileURL = url.format({
        pathname: fileLocation,
        protocol: "file:",
        slashes: true,
    });
    window.open(fileURL, fullName);
};

export const isHTML = {
    check: isHTMLCheck,
    execute: htmlExecute,
    display: "HTML pages",
    type: "HTML",
};

const isSWFCheck = ({file}) => {
    if (file.endsWith(".swf")) {
        return "SWF";
    } else {
        return false;
    }
};

const swfExecute = (fileLocation, name, parentDirectories) => {
    const fullName = `${parentDirectories}-${name}`;
    const directory = path.dirname(fileLocation);
    process.chdir(directory);
    const fileURL = url.format({
        pathname: fileLocation,
        protocol: "file:",
        slashes: true,
    });
    window.open(fileURL, fullName,
        "nodeIntegration=no, contextIsolation=yes");
};

export const isSWF = {
    check: isSWFCheck,
    execute: swfExecute,
    display: "SWF pages",
    type: "SWF",
};
