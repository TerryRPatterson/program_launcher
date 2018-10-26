import fs from "fs";
import url from "url";
import child_process from "child_process";
import path from "path";
import {homedir} from "os";
import moment from "moment";


let openLogFile = (
    fileURL,
    name,
    parentDirectories,
    outStream,
    errorStream) => {

    let fileNameSpaces = `${parentDirectories}|${name}`;
    let fileName = fileNameSpaces.replace(/ /g,"_");
    let logLocation = `${homedir()}/gameLogs/${fileName}`;
    let fileStream = fs.createWriteStream(logLocation, {flags:"a"});
    let timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");

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
        let timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        let message = `${timestamp} STDOUT: ${data}`;
        fileStream.write(message);
    });
    errorStream.on("data", (data) => {
        let timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        let message = `${timestamp} STDERR: ${data}`;
        fileStream.write(message);
    });
};

let isExecutableCheck = ({fileStat}) => {
    let pUID = process.getuid();
    let pGIDs = process.getgroups();
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
    let resultMask = fileStat.mode & comparisionMask;
    if (resultMask === 0) {
        return false;
    }
    else {
        return "Executable";
    }
};

let exectueProcess = (fileLocation, name, parentDirectories) => {
    let directory = path.dirname(fileLocation);
    process.chdir(directory);
    let child = child_process.spawn(fileLocation);
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

export let isExecutable = {
    check: isExecutableCheck,
    execute: exectueProcess,
    display: "Exectuables",
    type: "Executable"
};

let isHTMLCheck = ({file}) => {
    if (file.endsWith(".html")) {
        return "HTML";
    }
    else {
        return false;
    }
};

let htmlExecute = (fileLocation, name) => {
    let fileURL = url.format({
        pathname: fileLocation,
        protocol: "file:",
        slashes: true
    });
    window.open(fileURL, name ,"nodeIntegration=no, contextIsolation=yes");
};

export let isHTML = {
    check:isHTMLCheck,
    execute: htmlExecute,
    display: "HTML pages",
    type: "HTML"
};

let isSWFCheck = ({file}) => {
    if (file.endsWith(".swf")) {
        return "SWF";
    }
    else {
        return false;
    }
};

let swfExecute = (fileLocation, name) => {
    let directory = path.dirname(fileLocation);
    process.chdir(directory);
    let fileURL = url.format({
        pathname: fileLocation,
        protocol: "file:",
        slashes: true
    });
    window.open(fileURL, name ,
        "nodeIntegration=no, contextIsolation=yes");
};

export let isSWF = {
    check:isSWFCheck,
    execute: swfExecute,
    display: "SWF pages",
    type: "SWF"
};
