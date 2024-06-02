import { Component } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';

const cookies = new Cookies();

class NotAuthenticated extends Component{
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
    }

    login(){
        this.props.router.navigate("/login");
    }

    render(){
        return(
            <>
            {cookies.get('role') ?                 
                <Navigate replace to="/index" />
                : 
                <div className="submit-form">
                    <button onClick={this.login} className="btn btn-success mt-1 mb-1">
                    Login
                    </button><br/>
                </div> 
            }
            </>
        )
    }
}

export default withRouter(NotAuthenticated)