"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);


const checkFile = async (dir, file, checks, checkCurrent, prefix) => {
    let results = {};
    const fileURL = path.resolve(dir, file);
    const fileStat = await stat(fileURL);
    if (fileStat) {
        if (fileStat.isDirectory()) {
            const res = await findExecutables(fileURL, checks, checkCurrent,
                prefix);
            results = Object.assign(results, res);
            return results;
        }
        for (const {check} of checks) {
            const type = check({file, fileStat});
            // check returns false if it does not match and returns type string
            // the file matches check
            if (type) {
                const noPrefix = fileURL.replace(prefix, "");
                const parentDirectories = path.dirname(noPrefix);
                const noLeadingSlashParent = parentDirectories.replace(/^\//,
                    "");
                const fileExtension = path.extname(file);
                const nameNoExtension = file.replace(fileExtension, "");
                results[fileURL] = {
                    type,
                    nameNoExtension,
                    parentDirectories: noLeadingSlashParent,
                    name: file,
                    url: fileURL,
                };
                return results;
            }
        }
    }
    return false;
};

const findExecutables = async (directory, checks, checkCurrent,
    prefix=directory) => {
    const currentSearch = checkCurrent(prefix);
    if (!currentSearch) {
        return false;
    }
    let results = {};
    const promises = [];
    const nodes = await readdir(directory);
    const pending = nodes.length;
    if (!pending) return results;
    for (const node of nodes) {
        const fileInProgress = checkFile(directory, node, checks, checkCurrent,
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
