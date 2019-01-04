import findExecutables from "../lib/findExecutables";
import {isHTML, isExecutable, isSWF} from "../lib/fileChecks";
import Fuse from "fuse.js";


const checks = [isHTML, isExecutable, isSWF];


export const getFileList = (directory) => {
    return async (dispatch, getState) => {
        const checkCurrent = (prefix) => {
            const {loading} = getState();
            if (prefix !== loading) {
                return false;
            } else {
                return true;
            }
        };
        dispatch({type: "prefix/set", prefix: directory});
        dispatch({type: "loading", value: directory});
        const fileList = await findExecutables(directory, checks, checkCurrent);
        const {loading} = getState();
        if (loading === directory) {
            dispatch({type: "fileList", fileList});
            dispatch({type: "loading", value: false});
        }
    };
};

export const hideFile = (fileURL) => {
    const type = "blackList/add";
    return {type, entry: fileURL};
};

export const showFile = (fileURL) => {
    const type = "blackList/remove";
    return {type, entry: fileURL};
};

export const showAllFiles = (state, dispatch) => {
    state.blackList.forEach((entry) => dispatch(showFile(entry)));
};


export const filter = (filterTerm=null, fileList, blackList) => {
    if (filterTerm) {
        const options = {
            caseSensitive: false,
            shouldSort: true,
            tokenize: false,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "type",
                "name",
                "parentDirectories",
            ],
        };
        const fileListArray = Object.values(fileList).filter( ({url}) => {
            return !blackList[url];
        });
        const filter = new Fuse(fileListArray, options);
        const filteredList = filter.search(filterTerm);
        console.log(fileList);
        console.log(filteredList);
        return {type: "filter", newList: filteredList};
    } else {
        return {type: "filter", newList: []};
    }
};
