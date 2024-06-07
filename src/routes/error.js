import React from "react";
import MainNavbar from "../components/navbar.component";

const ErrorPage = (props) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:-1}}/>
                <h1 style={{marginTop: "20px"}}>Error</h1>
                <p>You shouldn't be here... Try following one of these links to get to your intended destination:</p>
                <ul>
                    <li><a href="/index">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li>
                        Artwork
                        <ul>
                            <li><a href="/y1">Year 1 (2019)</a></li>
                            <li><a href="/y2">Year 2 (2020)</a></li>
                            <li><a href="/y3">Year 3 (2021)</a></li>
                            <li><a href="/y4">Year 4 (2022)</a></li>
                            <li><a href="/y5">Year 5 (2023)</a></li>
                            <li><a href="/y6">Current (2024)</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};
 
export default ErrorPage;
