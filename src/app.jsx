import React from "react";
import FileList from "./components/FileList";
import PrefixDisplay from "./components/PrefixDisplay";
import {connect} from "react-redux";
import Loading from "./components/Loading";
import PropTypes from "prop-types";

const mapStateToProps = ({loading}) => {
    return {loading};
};

const App = ({loading}) => {
    return (
        <div className={"app"}>
            <PrefixDisplay/>
            {
                loading ?
                    <Loading/> :
                    <FileList/>
            }
        </div>

    );
};

App.propTypes = {
    loading: PropTypes.bool.isRequired,
};


const ConnectedApp = connect(mapStateToProps)(App);

export default ConnectedApp;
