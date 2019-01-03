"use strict";
import React from "react";
import {connect} from "react-redux";
import {remote} from "electron";
import {getFileList} from "../reducers/actionCreators";
import PropTypes from "prop-types";

const currentWindow = remote.getCurrentWindow();
const {dialog} = remote;

const mapStateToProps = ({prefix, loading}) => {
    return {prefix, loading};
};

const mapDispatchToProps = ((dispatch) => {
    const setNewPrefix = (prefix) => {
        dispatch(getFileList(prefix));
    };
    return {setNewPrefix};
});

const openPrefixDialogue = (oldPrefix="/", setNewPrefix=console.log) => {
    const properties = ["openDirectory", "showHiddenFiles"];
    const options = {
        properties,
        title: "Select Search Directory",
        defaultPath: oldPrefix,
    };
    const newPrefixArray = dialog.showOpenDialog(currentWindow, options);
    if (newPrefixArray) {
        const [newPrefix] = newPrefixArray;
        setNewPrefix(newPrefix);
    }
};


const PrefixDisplay = ({prefix, setNewPrefix}) => {
    const onClickHandler = () => {
        openPrefixDialogue(prefix, setNewPrefix);
    };
    return (
        <h3 onClick={onClickHandler}>Current directory: {prefix}</h3>
    );
};

PrefixDisplay.propTypes = {
    prefix: PropTypes.string.isRequired,
    setNewPrefix: PropTypes.func.isRequired,
};

const ConnectedPrefixDisplay = connect(mapStateToProps,
    mapDispatchToProps)(PrefixDisplay);

export default ConnectedPrefixDisplay;
