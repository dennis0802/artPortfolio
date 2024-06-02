import React from "react";
import MainNavbar from "../components/navbar.component";
import LoginForm from "../components/login.component";

const LoginPage = () => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:4}}/>
                <h1 style={{marginTop: "20px"}}>Login</h1>
                <LoginForm />
            </div>
        </div>
    );
};
 
export default LoginPage;
