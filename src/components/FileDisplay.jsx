import React from "react";
import {isExecutable, isHTML, isSWF} from "../lib/fileChecks";
import HideButton from "./HideButton";
import {connect} from "react-redux";
import {hideFile} from "../reducers/actionCreators";


let types = {};

types[isExecutable.type] = isExecutable.execute;
types[isHTML.type] = isHTML.execute;
types[isSWF.type] = isSWF.execute;


let mapDispatchToProps = (dispatch, {url}) => {
    let hide = (event) => {
        event.stopPropagation();
        dispatch(hideFile(url));
    };
    return {hide};
};

export let FileDisplay = ({type, url, name, setHover, unHover, hovered,
    parentDirectories, nameNoExtension}) => {
    let hover = (event) => {
        if (event.ctrlKey) {
            setHover();
        }
    };
    let execute = types[type];
    let onClickHandler = () => {
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
    }
    else {
        if (parentDirectories){
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

let ConnectedFileDisplay = connect(null,
    mapDispatchToProps)(FileDisplay);

export default ConnectedFileDisplay;
