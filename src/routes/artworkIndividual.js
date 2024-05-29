import React from "react";
import MainNavbar from "../components/navbar.component";
import Artwork from "../components/artwork.component";

const ArtworkIndividual = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={-1}/>
                <br/>
                <Artwork />
            </div>
        </div>
    );
};
 
export default ArtworkIndividual;
