import { Component } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import TokenDataService from '../service/token.service'
import LoadingComponent from './loading.component';

const cookies = new Cookies();

class LogoutForm extends Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
        this.checkJWT = this.checkJWT.bind(this);

        this.state = {
            load: false,
            loggedIn: false,
            networkError: false
        }
    }

    componentDidMount(){
        this.checkJWT();
    }

    checkJWT(){
        TokenDataService.decodeJWT(cookies.get('session'))
        .then(response =>{
          this.setState({
            load: true,
            loggedIn: response.data.role === 'ADMIN' || response.data.role === 'USER'
          })
        })
        .catch({

        })
    }

    logout(){
        const currentSession = cookies.get('session');
        cookies.remove("session", currentSession, {path: "/", maxAge: 10800, sameSite: "strict", secure: true});
        this.props.router.navigate("/");
    }

    render(){
        return(
            <>
            {this.state.load ?
                <>
                {this.state.loggedIn ? 
                    <div className="submit-form">
                        <button onClick={this.logout} className="btn btn-danger mt-3 mb-1">
                        Logout
                        </button><br/>
                    </div>
                :
                    <Navigate replace to="/notAuthenticated" />
                }
                </>
            :
                <>
                {this.state.networkError ?
                    <p className="mt-3">
                        There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.
                    </p>
                :
                    <>
                    <LoadingComponent />
                    </>
                }
                </>
            }
            </>
        )
    }
}

export default withRouter(LogoutForm)