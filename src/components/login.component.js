import { Component } from 'react';
import { withRouter } from '../common/with-router';
import UserDataService from '../service/user.service';
import StatusDataService from '../service/status.service';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import LoadingComponent from './loading.component';

const cookies = new Cookies();
const date = new Date();

class LoginForm extends Component{
    constructor(props){
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.goRecoverPassword = this.goRecoverPassword.bind(this);
        this.goCreateAccount = this.goCreateAccount.bind(this);

        this.state = {
            username: "",
            password: "",
            failure: false,
            activationFailure: false,
            currentUser: {
                last_login: date
            }
        }
    }

    onChangeUsername(e){
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    submitForm(e){
        this.setState({
            submitted: true
        })

        // Go to the form and find a user with the username
        UserDataService.getByUsername(this.state.username)
            .then(response => {
                if(response.data.length === 0){
                    this.setState({
                        failure: true,
                    })
                }
                else{
                    // Verify user is activated
                    StatusDataService.get(response.data.user_id)
                        .then(verifyRes => {
                            console.log(verifyRes);
                            if(verifyRes.data.isactive){
                                // Verify details match
                                UserDataService.verifyPassword(this.state.password, response.data.password)
                                    .then(res => {
                                        const success = res.data
                                        
                                        if(success){
                                            this.setState({
                                                failure: false,
                                                currentUser: response.data
                                            })
                                            cookies.set("user", response.data.username, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})
                                            cookies.set("role", response.data.role, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})

                                            // Change last login
                                            UserDataService.updateLogin(this.state.username, this.state.currentUser)
                                            .then(res =>{
                                                //console.log(res);
                                            })

                                            this.props.router.navigate("/");
                                        }
                                        else{
                                            this.setState({
                                                failure: true,
                                                submitted: false,
                                            })
                                        }
                                    })
                            }
                            else{
                                this.setState({
                                    failure: true,
                                    submitted: false,
                                    activationFailure: true
                                })
                            }
                        })
                }
            })
            .catch(e =>{
                this.setState({
                    failure: true,
                    submitted: false,
                })
                console.log(e);
            })
    }

    goCreateAccount(e){
        this.props.router.navigate("/createAccount")
    }

    goRecoverPassword(e){
        this.props.router.navigate("/recoverPassword")
    }

    render(){
        return(
            <>
                {!this.state.submitted ?
                (<>
                    {!cookies.get('role') ? 
                    <div className="submit-form">
                        {this.state.failure ? 
                            <div style={{color: "red", outline: "1px dashed red"}}>
                                <h5>LOGIN FAILED</h5>
                                {this.state.activationFailure ? <p>The account is not active.</p> : <p>The username or password is incorrect.</p>}
                            </div>
                        :
                            ""
                        }

                        <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            required
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                            onPaste={(e) => {e.preventDefault()}}
                            name="username"
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            required
                            value={this.state.password}
                            onChange={this.onChangePassword}
                            onPaste={(e) => {e.preventDefault()}}
                            name="password"
                        />
                        </div>

                        <button onClick={this.submitForm} className="btn btn-success mt-3 mb-1">
                        Login to Account
                        </button><br/>
                        <button onClick={this.goCreateAccount} className="btn btn-info mt-1 mb-1">
                        Create an Account
                        </button><br/>
                        <button onClick={this.goRecoverPassword} className="btn btn-warning mt-1 mb-1">
                        Forgot Your Password?
                        </button><br/>
                    </div>
                    :
                        <Navigate replace to="/index" />
                    }
                </>)
                :
                (<>
                    {!this.state.networkFailure ?
                        <>
                            <LoadingComponent />
                            <p>Logging in...</p>
                        </>
                    :
                        <p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>
                    }
                </>)
                }
            </>
        )
    }
}

export default withRouter(LoginForm)