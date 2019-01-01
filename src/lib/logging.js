import {Console} from "console";
import fs from "fs";
import moment from "moment";
import stream from "stream";
import {homedir} from "os";


let startLogging = (logLocation) => {
    let logStream = fs.createWriteStream(`${homedir()}/programLauncherLogs.txt`);
    let duplex = new stream.Duplex();
    let newConsole = new Console(duplex);
    duplex.on("data", (data) => {
        let timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
        let message = `${timestamp} STDOUT: ${data}`;
        logStream.write(message);
    });
    let oldConsole = window.console;
    window.console = newConsole;
};

export default startLogging;
