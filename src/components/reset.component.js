import { Component, Fragment } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie";
import { Navigate } from 'react-router-dom';
import UserDataService from '../service/user.service';
import TokenDataService from '../service/token.service';
import LoadingComponent from './loading.component';

const cookies = new Cookies();

class ResetForm extends Component {
    constructor(props){
        super(props);
        this.verifyToken = this.verifyToken.bind(this);
        this.redirectTo = this.redirectTo.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.submitCode = this.submitCode.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.submitNewPassword = this.submitNewPassword.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
        this.getUserFromToken = this.getUserFromToken.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.checkJWT = this.checkJWT.bind(this);

        this.state = {
            initialLoad: false,
            codeFailure: false,
            codeSubmitted: false,
            passwordSubmitted: false,
            expired: false,
            currentToken: null,
            code: "",
            password: "",
            passwordConfirm: "",
            passwordError: false,
            pageLoadError: false,
            loggedIn: false
        }
    }

    componentDidMount() {
        ////console.log(this.props.router.params.token);
        this.verifyToken(this.props.router.params.token);
        this.checkJWT();
    }

    checkJWT(){
        TokenDataService.decodeJWT(cookies.get('session'))
        .then(response =>{
          this.setState({
            loggedIn: response.data.role === 'ADMIN' || response.data.role === 'USER'
          })
        })
        .catch({

        })
    }

    verifyToken(){
        TokenDataService.findByToken(this.props.router.params.token)
        .then(response => {
            ////console.log(response);
            this.setState({
                initialLoad: true,
                currentToken: response.data
            })

            this.checkExpiry(response.data.expiry);
        })
        .catch(e => {
            this.setState({
                pageLoadError: true
            })
        })
    }

    checkExpiry(expiry){
        const now = new Date();
        if(now.getTime() > new Date(expiry).getTime()){
            this.setState({
                expired: true
            })
            this.deleteToken(this.props.router.params.token);

        }
    }

    deleteToken(token){
        TokenDataService.findByToken(token)
        .then(response => {
            TokenDataService.delete(response.data.user_id)
            .then(deletedResponse => {

            })
            .catch(e2 => {
                //console.log(e2);
            })
        })
        .catch(e => {
            //console.log(e);
        })
    }

    redirectTo(link){
        this.props.router.navigate(link);
    }

    onChangeCode(e){
        this.setState({
            code: e.target.value
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

    submitCode(){
        this.checkExpiry(this.state.currentToken.expiry);

        if(parseInt(this.state.currentToken.code) !== parseInt(this.state.code)){
            this.setState({
                codeFailure: true
            })
        }
        else{
            this.setState({
                codeFailure: false,
                codeSubmitted: true
            })
        }
    }

    submitNewPassword(){
        TokenDataService.findByToken(this.props.router.params.token)
        .then(response => {
            this.getUserFromToken(response);
        })
        .catch(e => {
            //console.log(e);
            this.setState({
                passwordError: true
            })
        })
    }

    getUserFromToken(response){
        UserDataService.get(response.data.user_id)
        .then(userResponse => {
            
            var user = {
                user_id: userResponse.data.user_id,
                username: userResponse.data.username,
                password: this.state.password,
                passwordConfirm: this.state.passwordConfirm,
                email: userResponse.data.email,
                role: userResponse.data.role,
                created_at: userResponse.data.created_at,
                last_login: userResponse.data.last_login
            }

            this.updatePassword(userResponse, user);
        })
        .catch(e => {
            //console.log(e);
            this.setState({
                passwordError: true
            })
        })
    }

    updatePassword(userResponse, user){
        UserDataService.update(userResponse.data.username, user)
        .then(updateResponse => {
            this.setState({
                passwordSubmitted: true
            })
            this.deleteToken(this.props.router.params.token);
        })
        .catch(e => {
            //console.log(e);
            this.setState({
                passwordError: true
            })
        })
    }

    render(){
        return(
            <>
            {this.state.initialLoad ?
                (<>
                {!this.state.loggedIn ?
                    (<>
                        {this.state.currentToken && !this.state.expired ?
                            (<>
                                {!this.state.codeSubmitted ? 
                                    (<>
                                        <h3>Code Submission</h3>
                                        <div className="submit-form">
                                            {this.state.codeFailure ?  
                                                <div style={{color: "red", outline: "1px dashed red"}} className='mt-2'>
                                                    <h5>ERROR</h5>
                                                    <p>The code was incorrect.</p>
                                                </div>
                                            : 
                                                <Fragment></Fragment>
                                            }
                                            <p className='mb-3'>Please submit the 15-digit code that was attached in your email to verify your identity.</p>
                                            <div className="form-group">
                                            <label htmlFor="code">Code</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="code"
                                                required
                                                value={this.state.code}
                                                onChange={this.onChangeCode}
                                                onPaste={(e) => {e.preventDefault()}}
                                                name="code"
                                            />
                                            </div>

                                            <button onClick={this.submitCode} className="btn btn-success mt-3 mb-1">
                                            Submit Code
                                            </button><br/>
                                        </div>
                                    </>)
                                :
                                    (<>
                                        {!this.state.passwordSubmitted ?
                                        (<>
                                            <h3>Enter New Password</h3>
                                            <p>Please enter your new password.</p>

                                            <h4>Requirements:</h4>
                                            <ul>
                                                <li>Has at least 1 uppercase letter and at least 1 lowercase letter.</li>
                                                <li>Has at least 1 numerical character and at least 1 special character.</li>
                                                <li>Be at least 8 characters long.</li>
                                            </ul>

                                            <div className="submit-form">
                                                {this.state.passwordError ?  
                                                    <div style={{color: "red", outline: "1px dashed red"}} className='mt-2'>
                                                        <h5>ERROR</h5>
                                                        <p>The password does not match the specified requirements!</p>
                                                    </div>
                                                : 
                                                    <Fragment></Fragment>
                                                }

                                                <div className="form-group mt-2">
                                                    <label htmlFor="password">New Password</label>
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

                                                <div className="form-group mt-2">
                                                    <label htmlFor="passwordConfirm">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="passwordConfirm"
                                                        required
                                                        value={this.state.passwordConfirm}
                                                        onChange={this.onChangePasswordConfirm}
                                                        onPaste={(e) => {e.preventDefault()}}
                                                        name="passwordConfirm"
                                                    />
                                                </div>

                                                <button onClick={this.submitNewPassword} className="btn btn-success mt-3 mb-1">
                                                Submit Password Change
                                                </button><br/>
                                            </div>
                                        </>)
                                        :
                                        (<>
                                            <h3>Success!</h3>
                                            <p>Your password has been successfully changed!</p>
                                            <div className="submit-form">
                                                <button onClick={() => {this.redirectTo('/login')}} className="btn btn-success mt-2 mb-1">
                                                Return to Login
                                                </button><br/>
                                            </div> 
                                        </>)
                                        }
                                    </>)
                                }
                            </>)
                        :
                        (<>
                            <h3>ERROR: Token cannot be verified.</h3>
                            {this.state.expired ? <p>Your token is expired.</p> : <p>Your token could not be found.</p>}
                            <p>Please fill out another request if you need to change your password.</p>
                            <div className="submit-form">
                                <button onClick={() => {this.redirectTo('/')}} className="btn btn-success mt-2 mb-1">
                                Return to Home
                                </button><br/>
                            </div> 
                        </>)
                        }
                    </>)
                :
                    (
                        <Navigate to="/" />
                    )
                }
                </>)
            :
                <>
                    {this.state.pageLoadError ?
                        (<p>Your token could not be verified. Ensure that it is valid and your network connection is stable.</p>)
                    :
                    (<>
                        <LoadingComponent />
                        <p>Loading...</p>
                    </>)
                    }
                </>
            }
            </>
        )
    }
}

export default withRouter(ResetForm)