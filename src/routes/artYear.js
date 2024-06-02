import React from "react";
import MainNavbar from "../components/navbar.component";
import ArtList from "../components/artlist.component";

const ArtYear = (year) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:3}}/>
                <h1 style={{marginTop: "20px"}}>{year.yearStart} Art</h1>
                <ArtList year={year.yearStart}/>
            </div>
        </div>
    );
};
 
export default ArtYear;
