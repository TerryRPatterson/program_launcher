import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";

import reducers from "./reducers/reducers";
import {getFileList} from "./reducers/actionCreators";

let searchDirectory = "/mnt/Big Slowish/Docs/nothing/games";


let frozenBlackList = localStorage.getItem("blackList");

let blackList = JSON.parse(frozenBlackList);


let initalState = {blackList, fileList:{}, loading:true};


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let rootReducer = combineReducers(reducers);

const store = createStore(rootReducer, initalState,
    composeEnhancers(applyMiddleware(thunk))
);

store.dispatch(getFileList(searchDirectory));

window.onload = () => {
    let appElement = React.createElement(App);
    let providerElement = React.createElement(Provider, {store}, appElement);
    ReactDOM.render(providerElement, document.getElementById("app"));
};

store.subscribe(() => {
    let state = store.getState();
    let blackList = state["blackList"];
    let frozenBlackList = JSON.stringify(blackList);
    localStorage.setItem("blackList", frozenBlackList);
});

window.addEventListener("beforeunload", () => {
    let state = store.getState();
    let blackList = state["blackList"];
    let frozenBlackList = JSON.stringify(blackList);
    localStorage.setItem("blackList", frozenBlackList);
});
