import React from "react";
import FileList from "./components/FileList";
import PrefixDisplay from "./components/PrefixDisplay";
import {connect} from "react-redux";
import Loading from "./components/Loading";

let mapStateToProps = ({loading}) => {
    return {loading};
};

let App = ({loading}) => {
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


let ConnectedApp = connect(mapStateToProps)(App);

export default ConnectedApp;
