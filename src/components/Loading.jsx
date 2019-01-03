"use strict";
import React from "react";
import svgData from "./svgData";

const Logo = () => {
    return <svg version="1.1" id="Layer_2_1_" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 841.9 595.3" enableBackground="new 0 0 841.9 595.3"
        xmlSpace="preserve">
        {/* eslint-disable max-len*/}
        <g>
            <path fill="#61DAFB" d={svgData}/>
            {/* eslint-enable max-len*/}
            <polygon fill="#61DAFB" points="320.8,78.4 320.8,78.4 320.8,78.4 "/>
            <circle fill="#61DAFB" cx="420.9" cy="296.5" r="45.7"/>
            <polygon fill="#61DAFB" points="520.5,78.1 520.5,78.1 520.5,78.1 "/>
        </g>
    </svg>;
};

let Loading = () => {

    return <svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid" className="loading"
        style={{background: "none"}}>
        <circle cx="50" cy="50" ng-attr-r="{{config.radius}}"
            ng-attr-stroke-width="{{config.width}}"
            ng-attr-stroke="{{config.c1}}"
            ng-attr-stroke-dasharray="{{config.dasharray}}" fill="none"
            strokeLinecap="round" r="40" strokeWidth="4" stroke="#222222"
            strokeDasharray="62.83185307179586 62.83185307179586"
            transform="rotate(324 50 50)">
            <animateTransform attributeName="transform" type="rotate"
                calcMode="linear"
                values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s"
                repeatCount="indefinite"></animateTransform>
        </circle>
        <circle cx="50" cy="50" ng-attr-r="{{config.radius2}}"
            ng-attr-stroke-width="{{config.width}}"
            ng-attr-stroke="{{config.c2}}"
            ng-attr-stroke-dasharray="{{config.dasharray2}}"
            ng-attr-stroke-dashoffset="{{config.dashoffset2}}" fill="none"
            strokeLinecap="round" r="35" strokeWidth="4" stroke="#00d8ff"
            strokeDasharray="54.97787143782138 54.97787143782138"
            strokeDashoffset="54.97787143782138"
            transform="rotate(-324 50 50)">
            <animateTransform attributeName="transform" type="rotate"
                calcMode="linear" values="0 50 50;-360 50 50" keyTimes="0;1"
                dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
        </circle>
        <Logo />
    </svg>;
};


export default Loading;
