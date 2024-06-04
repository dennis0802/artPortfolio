import React from "react";
import MainNavbar from "../components/navbar.component";
import RecoveryForm from "../components/recover.component";

const RecoveryPage = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Password Recovery</h1>
                <p>Please submit the email you created your account with.</p>
                <RecoveryForm />
            </div>
        </div>
    );
};
 
export default RecoveryPage;
