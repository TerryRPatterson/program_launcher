import findExecutables from "../lib/findExecutables";
import {isHTML, isExecutable, isSWF} from "../lib/fileChecks";


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
