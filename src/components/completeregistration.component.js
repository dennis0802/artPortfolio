import { Component, Fragment } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie";
import { Navigate } from 'react-router-dom';
import StatusDataService from '../service/status.service';
import LoadingComponent from './loading.component';
import TokenDataService from '../service/token.service';
import UserDataService from '../service/user.service';

const cookies = new Cookies();

class RegistrationForm extends Component {
    constructor(props){
        super(props);
        this.verifyToken = this.verifyToken.bind(this);
        this.redirectTo = this.redirectTo.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.submitCode = this.submitCode.bind(this);
        this.updateToken = this.updateToken.bind(this);
        this.generateNewToken = this.generateNewToken.bind(this);

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
            pageLoadError: false
        }
    }

    componentDidMount() {
        //console.log(this.props.router.params.token);
        this.verifyToken(this.props.router.params.token);
    }

    verifyToken(){
        StatusDataService.findByToken(this.props.router.params.token)
        .then(response => {
            console.log(response);
            this.setState({
                initialLoad: true,
                currentToken: response.data
            })

            if(response.data.isactive){
                this.setState({
                    pageLoadError: true
                })
            }

            this.checkExpiry(response.data.tokenexpiry);
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
        }
    }

    generateNewToken(){
        StatusDataService.findByToken(this.props.router.params.token)
        .then(response => {
            var newToken = {
                id: response.data.id,
                user_id: response.data.user_id,
                isactive: response.data.isactive,
                token: null,
                code: null,
                tokenexpiry: response.data.tokenexpiry
            }

            StatusDataService.updateWithNewToken(response.data.user_id, newToken)
            .then(updateResponse => {
                StatusDataService.findByUser(response.data.user_id)
                .then(resp => {
                    UserDataService.get(response.data.user_id)
                    .then(userResp => {
                        TokenDataService.sendRegistrationEmail(userResp.data.username, userResp.data.email, resp.data.code, resp.data.token);
                        this.props.router.navigate("/");
                    })
                    .catch(e4 => {
                        console.log(e4);
                    })
                })
                .catch(e3 => {
                    console.log(e3);
                })
            })
            .catch(e2 => {
                console.log(e2);
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    updateToken(token, data){
        StatusDataService.findByToken(token)
        .then(response => {

            StatusDataService.update(response.data.user_id, data)
            .then(updateResponse => {

            })
            .catch(e2 => {
                console.log(e2);
            })
        })
        .catch(e => {
            console.log(e);
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

            StatusDataService.findByToken(this.state.currentToken.token)
            .then(response => {
                var confirmedToken = {
                    id: response.data.id,
                    user_id: response.data.user_id,
                    isactive: true,
                    token: null,
                    code: null,
                    tokenexpiry: null
                }
                this.updateToken(this.props.router.params.token, confirmedToken);
            })
            .catch(e => {
                this.setState({
                    codeFailure: false,
                    codeSubmitted: true
                })
            })
        }
    }

    render(){
        return(
            <>
            {!cookies.get('role') ?
                (<>
                {this.state.initialLoad ?
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
                                        <h3>Success!</h3>
                                        <p>Your account has been activated!</p>
                                        <div className="submit-form">
                                            <button onClick={() => {this.redirectTo('/login')}} className="btn btn-success mt-2 mb-1">
                                            Return to Login
                                            </button><br/>
                                        </div> 
                                    </>)
                                }
                            </>)
                        :
                        (<>
                            <h3>ERROR: Token cannot be verified.</h3>
                            {this.state.expired ? <p>Your token is expired.</p> : <p>Your token could not be found.</p>}
                            <p>Please fill out another request if you need to change your password.</p>
                            <div className="submit-form">
                                {this.state.expired ? 
                                    <button onClick={this.generateNewToken} className="btn btn-success mt-2 mb-1">
                                    Generate New Token and Return Home
                                    </button>
                                :
                                    <button onClick={() => {this.redirectTo('/')}} className="btn btn-success mt-2 mb-1">
                                    Return to Home
                                    </button>
                                }
                                <br/>
                            </div> 
                        </>)
                        }
                    </>)
                :
                    (<>
                        {this.state.pageLoadError ?
                            (<p>Your token could not be verified. Ensure that it is valid and your network connection is stable.</p>)
                        :
                        (<>
                            <LoadingComponent />
                            <p>Loading...</p>
                        </>)
                        }
                    </>)
                }
                </>)
                :
                <Navigate to="/" />
                }
            </>
        )
    }
}

export default withRouter(RegistrationForm)