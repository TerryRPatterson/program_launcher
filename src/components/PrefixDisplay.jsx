"use strict";
import React from "react";
import {connect} from "react-redux";
import {remote} from "electron";
import {getFileList} from "../reducers/actionCreators";
const currentWindow = remote.getCurrentWindow();
const {dialog} = remote;

let mapStateToProps = ({prefix, loading}) => {
    return {prefix, loading};
};

let mapDispatchToProps = ((dispatch) => {
    let setNewPrefix = (prefix) => {
        dispatch(getFileList(prefix));
    };
    return {setNewPrefix};
});

let openPrefixDialogue = (oldPrefix="/", setNewPrefix=console.log) => {
    let properties = ["openDirectory", "showHiddenFiles"];
    let options = {
        properties,
        title: "Select Search Directory",
        defaultPath: oldPrefix,
    };
    let newPrefixArray = dialog.showOpenDialog(currentWindow, options);
    if (newPrefixArray) {
        let [newPrefix] = newPrefixArray;
        setNewPrefix(newPrefix);
    }

};


let PrefixDisplay = ({prefix, setNewPrefix}) => {

    let onClickHandler = () => {
        openPrefixDialogue(prefix, setNewPrefix);
    };
    return (
        <h3 onClick={onClickHandler}>Current directory: {prefix}</h3>
    );
};

let ConnectedPrefixDisplay = connect(mapStateToProps,
    mapDispatchToProps)(PrefixDisplay);

export default ConnectedPrefixDisplay;
