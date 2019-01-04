import React from "react";
import FileList from "./components/FileList";
import PrefixDisplay from "./components/PrefixDisplay";
import SearchBar from "./components/SearchBar";


const App = () => {
    return (
        <div className={"app"}>
            <SearchBar/>

            <PrefixDisplay/>
            {
                <FileList/>
            }
        </div>

    );
};


export default App;
