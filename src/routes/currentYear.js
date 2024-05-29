import React from "react";
import MainNavbar from "../components/navbar.component";
import ArtList from "../components/artlist.component";
 
const CurrentYear = (year) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:3}}/>
                <h1 style={{marginTop: "20px"}}>{year.yearStart}-{year.yearStart+1} Art</h1>
                <ArtList year={2024}/>
            </div>
        </div>
    );
};
 
export default CurrentYear;
