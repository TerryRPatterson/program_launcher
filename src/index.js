import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import {createStore, applyMiddleware, compose, combineReducers} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";

import reducers from "./reducers/reducers";
import {getFileList} from "./reducers/actionCreators";

const searchDirectory = "/mnt/Big Slowish/Docs/nothing/games";


const frozenBlackList = localStorage.getItem("blackList");

const blackList = JSON.parse(frozenBlackList);


const initalState = {blackList, fileList: {}, loading: true};


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(reducers);

const store = createStore(rootReducer, initalState,
    composeEnhancers(applyMiddleware(thunk))
);

store.dispatch(getFileList(searchDirectory));

window.onload = () => {
    const appElement = React.createElement(App);
    const providerElement = React.createElement(Provider, {store}, appElement);
    ReactDOM.render(providerElement, document.getElementById("app"));
};

store.subscribe(() => {
    const state = store.getState();
    const blackList = state["blackList"];
    const frozenBlackList = JSON.stringify(blackList);
    localStorage.setItem("blackList", frozenBlackList);
});

window.addEventListener("beforeunload", () => {
    const state = store.getState();
    const blackList = state["blackList"];
    const frozenBlackList = JSON.stringify(blackList);
    localStorage.setItem("blackList", frozenBlackList);
});
