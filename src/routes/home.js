import React from "react";
import MainNavbar from "../components/navbar.component";
import "../styles.css";
import Cookies from "universal-cookie";
import { Carousel, Image } from "react-bootstrap";

const cookies = new Cookies();

const Home = () => {
    return (
        <div className="App">
            <MainNavbar selected={{id:1}}/>
            <div id="page">
                <h1 style={{marginTop: "20px"}}>Digital Art Portfolio</h1>

                <h2>Latest Pieces</h2>
                <Carousel className="mb-3" style={{backgroundColor: "gray"}}>
                    <Carousel.Item >
                        <Image src="./img/Resonance of Rats.png" width={480} height={255} alt="Latest pieces" rounded/>
                        <Carousel.Caption>
                            <h4>Resonance of Rats</h4>
                            <p>May 2024</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src="./img/D-Boyz Expanded.png" width={480} height={255} alt="Latest pieces" rounded/>
                        <Carousel.Caption>
                        <h4>D-Boyz</h4>
                        <p>March 2024</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src="./img/The One with Challenge and Change.png" width={480} height={255} alt="Latest pieces" rounded/>
                        <Carousel.Caption>
                        <h4>The One With Challenge and Change</h4>
                        <p>February 2024</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                <p>Welcome to my portfolio of digital and traditional art that I've worked on since starting in May 2019.</p>

                <h2>Sitemap</h2>
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
                    {cookies.get('user') ?
                        <>
                            <li><a href="/account">Manage Your Info</a></li>
                            <li><a href="/logout">Logout</a></li>
                        </>
                    :
                        ""
                    }
                    {cookies.get('role') === 'ADMIN' ?
                        <>
                            <li><a href="/users">View Users</a></li>
                        </>
                    :
                        ""
                    }
                </ul>
            </div>
        </div>
    );
};
 
export default Home;
