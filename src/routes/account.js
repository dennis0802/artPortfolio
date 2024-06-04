import React from "react";
import MainNavbar from "../components/navbar.component";
import Account from "../components/account.component";

const AccountPage = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Your Account</h1>
                <Account />
            </div>
        </div>
    );
};
 
export default AccountPage;
