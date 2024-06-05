import React from "react";
import MainNavbar from "../components/navbar.component";
import ArtList from "../components/artlist.component";

const ArtYear = (props) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:3, subId: props.subId}}/>
                <h1 style={{marginTop: "20px"}}>{props.yearStart} Art</h1>
                <ArtList year={props.yearStart}/>
            </div>
        </div>
    );
};
 
export default ArtYear;
