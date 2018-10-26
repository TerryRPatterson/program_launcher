import findExecutables from "../lib/findExecutables";
import {isHTML, isExecutable, isSWF} from "../lib/fileChecks";


let checks = [isHTML, isExecutable, isSWF];



export let getFileList = (directory) => {

    return async (dispatch, getState) => {
        let checkCurrent = (prefix) => {
            let {loading} = getState();
            if (prefix !== loading){
                return false;
            } else {
                return true;
            }
        };
        dispatch({type:"prefix/set", prefix:directory});
        dispatch({type:"loading", value:directory});
        let fileList = await findExecutables(directory, checks, checkCurrent);
        let {loading} = getState();
        if (loading === directory) {
            dispatch({type:"fileList", fileList});
            dispatch({type:"loading", value:false});
        }
    };
};

export let hideFile = (fileURL) => {
    let type = "blackList/add";
    return {type, entry:fileURL};
};

export let showFile = (fileURL) => {
    let type = "blackList/remove";
    return {type, entry:fileURL};
};

export let showAllFiles = (state, dispatch) => {
    state.blackList.forEach((entry) => dispatch(showFile(entry)));
};
