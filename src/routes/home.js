import React from "react";
import MainNavbar from "../components/navbar.component";
import "../styles.css";
import Figure from "react-bootstrap/Figure";
 
const Home = () => {
    return (
        <div className="App">
            <MainNavbar selected={{id:1}}/>
            <div id="page">
                <h1 style={{marginTop: "20px"}}>Digital Art Portfolio</h1>
                
                <Figure>
                    <Figure.Image src="./img/Resonance of Rats.png" width={480} height={255} alt="Latest piece" rounded/>
                    <Figure.Caption>Latest art piece that I've worked on.</Figure.Caption>
                </Figure>
                <p>Welcome to my portfolio of digital and traditional art that I've worked on since starting in May 2019.</p>

                <h2>Sitemap</h2>
                <ul>
                    <li><a href="/index">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li>
                        Archive
                        <ul>
                            <li><a href="/y1">Year 1 (2019)</a></li>
                            <li><a href="/y2">Year 2 (2020)</a></li>
                            <li><a href="/y3">Year 3 (2021)</a></li>
                            <li><a href="/y4">Year 4 (2022)</a></li>
                            <li><a href="/y5">Year 5 (2023)</a></li>
                            <li><a href="/artwork">Current Year</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};
 
export default Home;
