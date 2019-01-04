"use strict";
import React from "react";
import {isExecutable, isHTML, isSWF} from "../lib/fileChecks";
import HideButton from "./HideButton";
import {connect} from "react-redux";
import {hideFile} from "../reducers/actionCreators";
import PropTypes from "prop-types";


const types = {};

types[isExecutable.type] = isExecutable.execute;
types[isHTML.type] = isHTML.execute;
types[isSWF.type] = isSWF.execute;

const mapStateToProps = ({blackList}) => {
    return {blackList};
};
const mapDispatchToProps = (dispatch, {url}) => {
    const hide = (event) => {
        event.stopPropagation();
        dispatch(hideFile(url));
    };
    return {hide};
};


/** Display a file.
    @function
    @param {object} main Contains all arguments.
    @param {string} main.type The type of the file.
    @param {string} main.url The url of the file.
    @param {string} main.name The name of the file.
    @param {function} main.setHover Function to set hovered element.
    @param {function} main.unHover Set to remove hovered element.
    @param {string} main.hovered The url of currently hovered element.
    @param {string} main.parentDirectories The name of the directories
        containing the file without the current search prefix.
    @param {string} main.nameNoExtension The name of the file without a file
        extension.
    @return {React.element}*/
export const FileDisplay = ({entry, blackList}) => {
    const {type, url, name, setHover, unHover, hovered,
        parentDirectories, nameNoExtension} = entry;
    if (blackList[url] === true) {
        return null;
    }
    const hover = (event) => {
        if (event.ctrlKey) {
            setHover();
        }
    };
    const execute = types[type];
    const onClickHandler = () => {
        execute(url, nameNoExtension, parentDirectories);
    };
    let body;
    if (url === hovered) {
        body = (
            <div>
            Type:{type}<br/>
            Url:{parentDirectories}<br/>
            Name:{name}<br/>
            </div>);
    } else {
        if (parentDirectories) {
            body = `${parentDirectories}/${name}`;
        } else {
            body = name;
        }
    }
    return (
        <div onClick={onClickHandler} className={"file_display"}
            onMouseEnter={hover} onMouseLeave={unHover}>
            <img src={`assets/${type}`} width="50px" height="50px"/>
            {body}
            <HideButton fileURL={url}/>
        </div>);
};

FileDisplay.propTypes = {
    entry: PropTypes.shape({
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        parentDirectories: PropTypes.string.isRequired,
        nameNoExtension: PropTypes.string.isRequired,
    }).isRequired,
    blackList: PropTypes.objectOf(PropTypes.bool.isRequired),
    setHover: PropTypes.func.isRequired,
    unHover: PropTypes.func.isRequired,
    hovered: PropTypes.string,
};

const ConnectedFileDisplay = connect(mapStateToProps,
    mapDispatchToProps)(FileDisplay);

export default ConnectedFileDisplay;
