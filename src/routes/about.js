import React from "react";
import MainNavbar from "../components/navbar.component";
import Figure from "react-bootstrap/Figure"; 
import Table from 'react-bootstrap/Table';
import '../styles.css';

const About = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:2}}/>
                <h1 style={{marginTop: "20px"}}>About Me</h1>
                <Figure>
                    <Figure.Image src="./img/everywhere.png" width={300} height={300} alt="My inspiration for my artwork" rounded/>
                    <Figure.Caption>
                        My largest and most abstract project, and filled with the people that inspire me to make great artwork.
                        Made in April 2023, I've named this after the iconic film <i>Everything Everywhere All at Once</i> and its poster.
                    </Figure.Caption>
                </Figure>

                <div className="line-1 anim-typewriter mt-3" >
                    <h6 style={{fontWeight: "bold"}}>Hi there, I'm Dennis - a web developer and a digital artist.</h6>
                </div>
                <p>
                    Since starting on visual arts hobbies more heavily in May 2019, I've developed a cartoon-ish/realism style that I enjoy making pieces 
                    for my friends. I work in a variety of mediums, ranging from digital art using GIMP to traditional acrylics and watercolours on paper/canvas.
                </p>
                <br/>

                <p>
                    After seeing an image from the game <i>Celeste</i>, I was really interested in trying to put my group of friends and myself into the scene. Despite the fact
                    that it was intended as an inside joke, it allowed me to start developing my style with drawing people <i>(ironically, the aspect of drawing I liked the least until then). </i>
                    Since then, I've worked on my style for posing and learned new tools to create more artwork.
                </p><br/>

                <h2>What I've Worked With</h2>
                <Table striped bordered hover responsive="sm" variant="dark" style={{marginLeft: "auto", marginRight: "auto", maxWidth: "1000px"}}>
                    <thead>
                        <tr>
                            <th>Digital</th>
                            <th>Traditional</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <li>GIMP</li>
                                    <li>Photoshop</li>
                                    <li>Microsoft Clipchamp</li>
                                    <li>Photography</li>
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    <li>Acrylics</li>
                                    <li>Colored Pencils</li>
                                    <li>Oil Pastels</li>
                                    <li>Watercolours</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
};
 
export default About;
