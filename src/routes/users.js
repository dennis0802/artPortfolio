import React from "react";
import MainNavbar from "../components/navbar.component";
import UserList from "../components/userlist.component";

const Users = (year) => {
    return (
        <div className="App">
            <div id="page">
                <MainNavbar selected={{id:5}}/>
                <h1 style={{marginTop: "20px"}}>User List</h1>
                <UserList />
            </div>
        </div>
    );
};
 
export default Users;
