const fs = require("fs");
const path = require("path");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);




let checkFile = async (dir, file, checks, checkCurrent, prefix) => {
    let results = {};
    let fileURL = path.resolve(dir, file);
    let fileStat = await stat(fileURL);
    if (fileStat){
        if (fileStat.isDirectory()) {
            let res = await findExecutables(fileURL, checks, checkCurrent,
                prefix);
            results = Object.assign(results, res);
            return results;
        }
        for (let {check} of checks) {
            let type = check({file, fileStat});
            //check returns false if it does not match and returns type string
            // the file matches check
            if (type) {
                let noPrefix = fileURL.replace(prefix, "");
                let parentDirectories = path.dirname(noPrefix);
                let noLeadingSlashParent = parentDirectories.replace(/^\//, "");
                let fileExtension = path.extname(file);
                let nameNoExtension = file.replace(fileExtension, "");
                results[fileURL] = {
                    type,
                    nameNoExtension,
                    parentDirectories: noLeadingSlashParent,
                    name:file,
                    url:fileURL,
                };
                return results;
            }
        }
    }
    return false;
};
let findExecutables = async (directory, checks, checkCurrent,
    prefix=directory) => {
    let currentSearch = checkCurrent(prefix);
    if (!currentSearch) {return false;}
    let results = {};
    let promises = [];
    let nodes = await readdir(directory);
    let pending = nodes.length;
    if (!pending) return results;
    for (let node of nodes) {
        let fileInProgress = checkFile(directory, node, checks, checkCurrent,
            prefix).then(
            (usefulBits) => {
                if (usefulBits) {
                    results = Object.assign(results, usefulBits);
                }
            });
        promises.push(fileInProgress);
    }
    await Promise.all(promises);
    return results;
};

export default findExecutables;
