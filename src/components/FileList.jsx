"use strict";
import React from "react";
import {connect} from "react-redux";
import FileDisplay from "./FileDisplay";
import Loading from "./Loading";
import PropTypes from "prop-types";


const mapStateToProps = ({fileList, loading, filter}) => {
    return {fileList, loading, filter};
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
        @ignore
        */
    render() {
        const {fileList, loading, filter} = this.props;
        const {hovered} = this.state;
        if (Object.keys(fileList).length === 0 || loading) {
            return <Loading/>;
        }
        let componentList;
        if (Array.isArray(filter) && filter.length > 0) {
            componentList = filter.map( (entry) => {
                const {url} = entry;
                return <FileDisplay entry={entry} hovered={hovered} key={url}
                    setHover={() => this.setHover(url)}
                    unHover={() => this.setHover(null)}/>;
            });
        } else {
            componentList = Object.keys(fileList).sort().map((url) => {
                const entry = fileList[url];
                return <FileDisplay entry={entry} hovered={hovered} key={url}
                    setHover={() => this.setHover(url)}
                    unHover={() => this.setHover(null)}/>;
            });
        }
        return <div className={"file_list"}>
            {componentList}
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
    loading: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
    filter: PropTypes.array.isRequired,
};


const ConnectedFileList = connect(mapStateToProps)(FileList);

export default ConnectedFileList;
