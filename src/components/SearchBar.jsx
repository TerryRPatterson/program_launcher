"use strict";
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {filter} from "../reducers/actionCreators";
import {throttle} from "lodash";

const mapDispatchToProps = (dispatch) => {
    const filterList = (filterTerm, fileList, blackList) => {
        dispatch(filter(filterTerm, fileList, blackList));
    };
    const throttledFilterList = throttle(filterList, 1000);
    return {filterList: throttledFilterList};
};

const mapStateToProps = ({fileList, blackList}) => {
    return {fileList, blackList};
};

/** Filters displayed programs */
class FilterBar extends React.Component {
    /** @constructor
        @param {object} props  The react properties of the compenent.
        @param {object} props.fileList The list of currently displayed files.
    */
    constructor(props) {
        super(props);
        this.state = {filterTerm: ""};
        this.setFilterTerm = this.setFilterTerm.bind(this);
    }


    /** @ignore The render logic of the filter bar
    @return {React.element}
    */
    render() {
        return (
            <div>
                <input type="search" spellCheck="false" name="filter"
                    placeholder="filter list" value={this.state.filterTerm}
                    onChange={this.setFilterTerm}
                    onSubmit={(e) => e.preventDefault()}/>
            </div>
        );
    }

    /** Set which term is currently being filtered for
    @param {string} event the new term that is being filtered for.*/
    setFilterTerm(event) {
        const {target: {value: newTerm}} = event;
        const {fileList, blackList} = this.props;
        this.setState(() => {
            return {filterTerm: newTerm};
        });
        this.props.filterList(newTerm, fileList, blackList);
    }
}

FilterBar.propTypes = {
    fileList: PropTypes.objectOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        nameNoExtension: PropTypes.string.isRequired,
        parentDirectories: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
    })).isRequired,
    filterList: PropTypes.func.isRequired,
    blackList: PropTypes.objectOf(PropTypes.bool.isRequired),
};

const conntectedFilterBar = connect(mapStateToProps,
    mapDispatchToProps)(FilterBar);
export default conntectedFilterBar;
