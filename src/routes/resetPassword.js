import React from "react";
import MainNavbar from "../components/navbar.component";
import ResetForm from "../components/reset.component";

const ResetPage = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Password Recovery</h1>
                <ResetForm />
            </div>
        </div>
    );
};
 
export default ResetPage;
