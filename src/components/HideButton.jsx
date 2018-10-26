import React from "react";
import {connect} from "react-redux";
import {hideFile} from "../reducers/actionCreators";

let mapDispatchToProps = (dispatch, {fileURL}) => {
    let hide = (e) => {
        e.stopPropagation();
        dispatch(hideFile(fileURL));
    };
    return {hide};
};

let HideButton = ({hide}) => {
    return <img src="assets/Close.png" width="20px" height="20px"
        onClick={hide}  className={"corner_button"}/>;
};

let ConnectedHideButton = connect(null, mapDispatchToProps)(HideButton);

export default ConnectedHideButton;
