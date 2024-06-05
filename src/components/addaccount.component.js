import { Component } from 'react';
import { withRouter } from '../common/with-router';
import UserDataService from '../service/user.service';
import Cookies from "universal-cookie";
import { Navigate } from 'react-router-dom';
import LoadingComponent from './loading.component';

const cookies = new Cookies();

class AccountForm extends Component{
    constructor(props){
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.returnToLogin = this.returnToLogin.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.getMaxCount = this.getMaxCount.bind(this);

        this.state = {
            username: "",
            password: "",
            passwordConfirm: "",
            email: "",
            role: "",
            created_at: null,
            success: false,
            failure: false,
            uniqueFailure: false,
            networkError: false,
            count: 0,
            
            submitted: true,
            initialLoad: false
        }
    }

    componentDidMount(){
        this.getMaxCount();
    }

    // Get max count for new records (new records will have id of max+1)
    getMaxCount(){
        UserDataService.findMaxID().then(response => {
            this.setState({
                count: response.data.max === null ? 0 : response.data.max,
                submitted: false,
                initialLoad: true
            })
        })
        .catch((e) => {
            console.log(e);
            this.setState({
                submitted: true,
                networkError: true
            })
        })
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

    onChangePasswordConfirm(e){
        this.setState({
            passwordConfirm: e.target.value
        })
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    submitForm(e){
        this.setState({
            submitted: true
        })

        var data = {
            user_id: this.state.count + 1,
            username: this.state.username,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm,
            email: this.state.email,
            role: "USER",
        }

        // Check for uniqueness
        UserDataService.getByUsername(this.state.username)
            .then(response => {
                console.log(response.data);
                if(response.data.length !== 0){
                    this.setState({
                        failure: true,
                        uniqueFailure: true,
                        submitted: false
                    })
                }
            })
            .catch(e =>{
                this.setState({
                    failure: true,
                    uniqueFailure: false,
                    submitted: false
                })
                console.log(e);
            })

        UserDataService.getByEmail(this.state.email)
            .then(response => {
                console.log(response.data);
                if(response.data.length !== 0){
                    this.setState({
                        failure: true,
                        uniqueFailure: true,
                        submitted: false
                    })
                }
            })
            .catch(e =>{
                window.scrollTo(0, 0)
                this.setState({
                    failure: true,
                    uniqueFailure: false,
                    submitted: false
                })
                console.log(e);
            })

        UserDataService.create(data)
        .then(response => {
            this.setState({
                user_id: response.data.user_id,
                username: response.data.username,
                email: response.data.email,
                created_at: response.data.created_at,
                role: response.data.role,
                reflection: response.data.reflection,
        
            });
            console.log(response.data);

            // Set user as logged in
            cookies.set("user", response.data.username, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})
            cookies.set("role", response.data.role, {path: "/", maxAge: 43200, sameSite: "strict", secure: true})
            this.props.router.navigate("/");
        })
        .catch(e => {
            window.scrollTo(0, 0)
            this.setState({
                failure: true,
                uniqueFailure: false
            })
            console.log(e);
        })
    }

    returnToLogin(e){
        this.props.router.navigate("/login")
    }

    render(){
        return(
            <>
            {!cookies.get('role') ?
                <>
                    {!this.state.submitted ? 
                    <div className="submit-form">
                        {this.state.failure ? 
                        <div style={{color: "red", outline: "1px dashed red"}}>
                            <p style={{fontWeight: "bold"}}>The submission was unsuccessful.</p>
                            <p>Ensure the following is satisfied for a successful submission:</p>
                            <ul>
                                <li>Usernames should be composed of only alphabetical and numerical characters.</li>
                                <li>Refer to the listed password requirements below and ensure confirmation matches.</li>
                                <li>Submit a valid email.</li>
                                <li>Ensure your connection is stable - if you're certain your information is valid, refresh the page.</li>
                                {this.state.uniqueFailure ? <li>The submitted email or username has already been used. Please submit a different one.</li>: ""}
                            </ul>
                        </div>
                        : 
                        ""}

                        <div className="form-group mt-2">
                        <label htmlFor="username">Username</label>
                        <div style={{fontWeight: "bold"}}>
                        <p>Your username must:</p>
                            <ul>
                                <li>Be composed of only numerical and alphabetical characters.</li>
                            </ul>
                        </div>
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

                        <div className="form-group mt-2">
                        <label htmlFor="password">Password</label>
                        <div style={{fontWeight: "bold"}}>
                        <p>Your password must:</p>
                            <ul>
                                <li>Have 1 uppercase letter and 1 lowercase letter.</li>
                                <li>Have 1 numerical character and 1 special character.</li>
                                <li>Be at least 8 characters long.</li>
                            </ul>
                        </div>
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

                        <div className="form-group mt-2">
                        <label htmlFor="passwordConfirm">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordConfirm"
                            required
                            value={this.state.passwordConfirm}
                            onChange={this.onChangePasswordConfirm}
                            name="passwordConfirm"
                        />

                        {
                            this.state.password && this.state.passwordConfirm ? 
                            this.state.password === this.state.passwordConfirm ? 
                            <p style={{color:"green"}}>Passwords match.</p>
                            : 
                            <p style={{color:"red"}}>Passwords do not match.</p>
                            : 
                            ""
                        }

                        </div>

                        <div className="form-group mt-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            required
                            value={this.state.email}
                            onChange={this.onChangeEmail}
                            name="email"
                        />
                        </div>

                        <button onClick={this.submitForm} className="btn btn-success mt-3 mb-1">
                        Create Account
                        </button><br/>
                        <button onClick={this.returnToLogin} className="btn btn-danger mt-1 mb-1">
                        Return to Login
                        </button><br/>
                    </div>
                    :
                    <>
                        {this.state.networkError ?
                            <p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>
                        :
                        <>
                            <LoadingComponent />
                            <p>{this.state.initialLoad ? "Creating your account..." : "Loading..." }</p>
                        </>
                        }
                    </>
                    }
                </>
                :
                    <Navigate replace to="/index" />
                }   
            </>
        )
    }
}

export default withRouter(AccountForm)