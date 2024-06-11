import { Component } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import LoadingComponent from './loading.component';
import TokenDataService from '../service/token.service'

const cookies = new Cookies();

class NotAuthenticated extends Component{
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.checkJWT = this.checkJWT.bind(this);

        this.state = {
            loggedIn: false,
            load: false,
            networkError: false,
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

    login(){
        this.props.router.navigate("/login");
    }

    render(){
        return(
            <>
            {this.state.load ?
                <>
                {this.state.loggedIn ?                 
                    <Navigate replace to="/index" />
                : 
                    <div className="submit-form">
                        <button onClick={this.login} className="btn btn-success mt-1 mb-1">
                        Login
                        </button><br/>
                    </div> 
                }
                </>
            :
                <>
                {this.state.networkError ?
                    <p className="mt-3">
                        There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.
                    </p>
                :
                    <LoadingComponent />
                }
                </>
            }
            </>
        )
    }
}

export default withRouter(NotAuthenticated)