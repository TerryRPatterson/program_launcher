export let fileList = (prevState={}, action) => {
    if (action.type === "fileList") {
        return action["fileList"];
    }
    return prevState;
};

export let blackList = (prevState={}, action) => {
    let namespace = /^blackList\//;
    if (namespace.test(action.type)) {
        let type = action.type.replace(namespace, "");
        if (type === "add") {
            let newEntry = {[action["entry"]]:true};
            let newList = Object.assign({}, prevState, newEntry);
            return newList;
        }
        else if (type === "remove") {
            let newList = Object.assign({}, prevState);
            delete newList[action["entry"]];
            return newList;
        }
    }
    return prevState;
};


export let prefix = (prevState=null, action) => {
    let namespace = /^prefix\//;
    if (namespace.test(action.type)) {
        let type = action.type.replace(namespace, "");
        if (type === "set") {
            return action.prefix;
        }
    }
    return prevState;
};

export let loading = (prevState=true, action) => {
    if (action.type === "loading") {
        return action["value"];
    }
    return prevState;
};


let reducers = {fileList, blackList, prefix, loading};

export default reducers;
