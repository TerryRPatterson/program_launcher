"use strict";
import React from "react";
import {connect} from "react-redux";
import FileDisplay from "./FileDisplay";
import Loading from "./Loading";
import PropTypes from "prop-types";


const mapStateToProps = ({fileList, blackList}) => {
    return {fileList, blackList};
};

/** List of files stored in redux store.
    */
export class FileList extends React.Component {
    /** Set which file is currently hovered.
        @param {string} fileURL the file url of the currently hovered.
        @return {undefined}*/
    setHover(fileURL) {
        this.setState(() => {
            return {hovered: fileURL};
        });
    }

    /** @constructor
        @param {object} props the passed properties of the react component.
        @param {object} props.fileList a list of files to display.
        @param {string} props.fileList.type the type of the file.
        @param {string} props.fileList.nameNoExtension The name of the file no
            extension.
        @param {string} props.fileList.parentDirectories The parent directories
            exluding the search prefix.
        @param {string} props.fileList.name The name of the file.
        @param {string} props.fileList.url The url to the file.
        @param {object} propes.blackList The blacklist of file not to be
            displayed. The key should be the file url and the value true if the
            file is blacklisted.
    */
    constructor(props) {
        super(props);
        this.state = {hovered: null};
    }

    /** Rendering logic for the component.
        @return {React.element}
        */
    render() {
        const {fileList, blackList} = this.props;
        const {hovered} = this.state;
        if (Object.keys(fileList).length === 0) {
            return <Loading/>;
        }
        return <div className={"file_list"}>
            <h3></h3>
            {Object.keys(fileList).sort().map((fileURL) => {
                if (blackList[fileURL] === true) {
                    return null;
                }
                const {
                    type,
                    name,
                    url,
                    parentDirectories,
                    nameNoExtension,
                } = fileList[fileURL];
                return <FileDisplay type={type} name={name} hovered={hovered}
                    parentDirectories={parentDirectories}
                    key={url} url={url} nameNoExtension={nameNoExtension}
                    setHover={() => this.setHover(url)}
                    unHover={() => this.setHover(null)}/>;
            })}
        </div>;
    }
}

FileList.propTypes = {
    fileList: PropTypes.objectOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        nameNoExtension: PropTypes.string.isRequired,
        parentDirectories: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    })),
    blackList: PropTypes.objectOf(PropTypes.bool.isRequired),
};


const ConnectedFileList = connect(mapStateToProps)(FileList);

export default ConnectedFileList;
