import { Component } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';

const cookies = new Cookies();

class LogoutForm extends Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(){
        const currentUser = cookies.get('user');
        const role = cookies.get('role');
        cookies.remove("user", currentUser, {path: "/", maxAge: 43200, sameSite: "strict", secure: true});
        cookies.remove("role", role, {path: "/", maxAge: 43200, sameSite: "strict", secure: true});
        this.props.router.navigate("/");
    }

    render(){
        return(
            <>
            {cookies.get('role') ? 
                <div className="submit-form">
                    <button onClick={this.logout} className="btn btn-danger mt-3 mb-1">
                    Logout
                    </button><br/>
                </div>
            :
                <Navigate replace to="/notAuthenticated" />
            }
            </>
        )
    }
}

export default withRouter(LogoutForm)