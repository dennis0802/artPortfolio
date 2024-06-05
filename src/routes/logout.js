import React from "react";
import MainNavbar from "../components/navbar.component";
import LogoutForm from "../components/logout.component";

const LogoutPage = (props) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4, subId: props.subId}}/>
                <h1 style={{marginTop: "20px"}}>Logout</h1>
                <p>Are you sure you want to logout?</p>
                <LogoutForm />
            </div>
        </div>
    );
};
 
export default LogoutPage;
