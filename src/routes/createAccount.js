import React from "react";
import MainNavbar from "../components/navbar.component";
import AccountForm from "../components/addaccount.component";

const CreateAccount = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Create Account</h1>
                <AccountForm />
            </div>
        </div>
    );
};
 
export default CreateAccount;
