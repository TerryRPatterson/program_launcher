export const fileList = (prevState={}, action) => {
    if (action.type === "fileList") {
        return action["fileList"];
    }
    return prevState;
};

export const blackList = (prevState={}, action) => {
    const namespace = /^blackList\//;
    if (namespace.test(action.type)) {
        const type = action.type.replace(namespace, "");
        if (type === "add") {
            const newEntry = {[action["entry"]]: true};
            const newList = Object.assign({}, prevState, newEntry);
            return newList;
        } else if (type === "remove") {
            const newList = Object.assign({}, prevState);
            delete newList[action["entry"]];
            return newList;
        }
    }
    return prevState;
};


export const prefix = (prevState=null, action) => {
    const namespace = /^prefix\//;
    if (namespace.test(action.type)) {
        const type = action.type.replace(namespace, "");
        if (type === "set") {
            return action.prefix;
        }
    }
    return prevState;
};

export const loading = (prevState=true, action) => {
    if (action.type === "loading") {
        return action["value"];
    }
    return prevState;
};


const reducers = {fileList, blackList, prefix, loading};

export default reducers;
