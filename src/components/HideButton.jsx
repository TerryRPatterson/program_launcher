import React from "react";
import {connect} from "react-redux";
import {hideFile} from "../reducers/actionCreators";
import PropTypes from "prop-types";

const mapDispatchToProps = (dispatch, {fileURL}) => {
    const hide = (e) => {
        e.stopPropagation();
        dispatch(hideFile(fileURL));
    };
    return {hide};
};

const HideButton = ({hide}) => {
    return <img src="assets/Close.png" width="20px" height="20px"
        onClick={hide} className={"corner_button"}/>;
};

HideButton.propTypes ={
    hide: PropTypes.func.isRequired,
};

const ConnectedHideButton = connect(null, mapDispatchToProps)(HideButton);

export default ConnectedHideButton;
