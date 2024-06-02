import { Component } from 'react';
import { withRouter } from '../common/with-router';
import UserDataService from '../service/user.service';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';

const cookies = new Cookies();

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
            failure: false
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
        // Go to the form and find a user with the username
        UserDataService.getByUsername(this.state.username)
            .then(response => {
                console.log(response.data);
                if(response.data.length === 0){
                    this.setState({
                        failure: true,
                    })
                }
                else{
                    // Verify details match
                    UserDataService.verifyPassword(this.state.password, response.data[0].password)
                        .then(res => {
                            const success = res.data
                            
                            if(success){
                                this.setState({
                                    failure: false,
                                })
                                cookies.set("user", response.data[0].username, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})
                                cookies.set("role", response.data[0].role, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})
                                this.props.router.navigate("/");
                            }
                            else{
                                this.setState({
                                    failure: true,
                                })
                            }
                        })
                }
            })
            .catch(e =>{
                this.setState({
                    failure: true
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
                {!cookies.get('role') ? 
                <div className="submit-form">
                    {this.state.failure ? 
                        <div style={{color: "red", outline: "1px dashed red"}}>
                            <h5>ERROR</h5>
                            <p>The username or password is incorrect.</p>
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
            </>
        )
    }
}

export default withRouter(LoginForm)