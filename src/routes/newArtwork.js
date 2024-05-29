import React from "react";
import MainNavbar from "../components/navbar.component";
import "../styles.css";
import AddArtwork from "../components/addartwork.component";
 
const NewArtwork = (year) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:3}}/>
                <h1 style={{marginTop: "20px"}}>Add Artwork</h1>
                <AddArtwork />
            </div>
        </div>
    );
};
 
export default NewArtwork;
