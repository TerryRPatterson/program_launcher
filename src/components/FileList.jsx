import React from "react";
import {connect} from "react-redux";
import FileDisplay from "./FileDisplay";
import Loading from "./Loading";


const mapStateToProps = ({fileList, blackList}) => {
    return {fileList, blackList};
};

export class FileList extends React.Component {
    setHover(fileURL) {
        this.setState(() => {
            return {hovered: fileURL};
        });
    }

    constructor(props) {
        super(props);
        this.state = {hovered: null};
    }

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
                    execute,
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


const ConnectedFileList = connect(mapStateToProps)(FileList);

export default ConnectedFileList;
