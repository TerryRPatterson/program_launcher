import fs from "fs";
import moment from "moment";


const startLogging = (webContents, logFolder="./logs", name="main") => {
    const logTimestamp = moment().format("MMMM-Do-YYYY-h-a");
    const fileNameSpaces = `${name}-${logTimestamp}.log`;
    const fileName = fileNameSpaces.replace(/ /g, "_");
    const logLocation = `${logFolder}/${fileName}`;
    const levels = {0: "Info", 1: "Warning", 2: "Error"};
    const logFileStream = fs.createWriteStream(logLocation, {flags: "a"});
    logFileStream.on("error", (error) => {
        if (error.code === "ENOENT") {
            fs.mkdir(logFolder, (error) => {
                if (error) {
                    throw error;
                } else {
                    startLogging(webContents, logFolder, name);
                }
            });
        } else {
            throw error;
        }
    });
    webContents.on("console-message", (event, level, message) => {
        const timestamp = moment().format("MMMM Do YYYY h:mm:ss a");
        const formattedMessage = `${timestamp} ${levels[level]}: ${message}\n`;
        logFileStream.write(formattedMessage);
    });
};

export default startLogging;
