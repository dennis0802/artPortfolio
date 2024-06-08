import React from "react";
import MainNavbar from "../components/navbar.component";
import CompleteRegistration from "../components/completeregistration.component";

const RegistrationPage = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Complete Registration</h1>
                <CompleteRegistration />
            </div>
        </div>
    );
};
 
export default RegistrationPage;
