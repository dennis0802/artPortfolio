import React from "react";
import MainNavbar from "../components/navbar.component";
import "../styles.css";
import NotAuthenicated from "../components/notauthenticated.component";
import { useNavigate } from "react-router-dom";


const NotAuthenticated = () => {
    const navigate = useNavigate();

    return (
        <div className="App">
            <MainNavbar selected={{id:-1}}/>
            <div id="page">
                <h1 style={{marginTop: "20px"}}>Not Logged In</h1>
            
                <p>You must be logged in to do that.</p>
                <NotAuthenicated navigate={navigate}/>
            </div>
        </div>
    );
};
 
export default NotAuthenticated;
