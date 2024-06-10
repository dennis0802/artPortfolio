import { Component, Fragment } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import UserDataService from '../service/user.service';
import TokenDataService from '../service/token.service';
import LoadingComponent from './loading.component';

const cookies = new Cookies();

class RecoveryForm extends Component{
    constructor(props){
        super(props);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.returnToLogin = this.returnToLogin.bind(this);
        this.returnToIndex = this.returnToIndex.bind(this);
        this.getMaxId = this.getMaxId.bind(this);
        this.sendEmail = this.sendEmail.bind(this);

        this.state = {
            email: "",
            failure: false,
            submitted: false,
            initialLoad: false,
            networkError: false,
            count: 0,
            id: -1
        }
    }

    componentDidMount(){
        this.getMaxId();
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    // Get max count for new records (new records will have id of max+1)
    getMaxId(){
        TokenDataService.getMaxID().then(response => {
            this.setState({
                count: response.data.max === null ? 0 : response.data.max,
                initialLoad: true
            })
        })
        .catch((e) => {
            console.log(e);
            this.setState({
                networkError: true
            })
        })
    }

    submitForm(e){
        UserDataService.getByEmail(this.state.email)
        .then(response1 => {
            this.setState({
                failure: false,
                submitted: true,
                id: response1.data.user_id
            })

            // Check the user exists
            if(response1.data !== ""){
                this.findUserToken(response1);
            }
        })
        .catch(e =>{
            this.setState({
                failure: true
            })
            console.log(e);
        })
    }

    findUserToken(response){
        TokenDataService.findByUser(response.data.user_id)
        .then(response2 => {

            // User already has a token - delete it
            if(response2.data !== ""){
                this.deleteExistingToken(response)
            }
            // User does not have a token
            else{
                this.createResetToken(response, this.state.count);
            }
        })
    }

    deleteExistingToken(response){
        TokenDataService.delete(response.data.user_id)
        .then(deleted => {
            this.createResetToken(response, this.state.count - 1);
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    createResetToken(response, count){
        TokenDataService.createResetToken(response.data.user_id, count)
        .then(created => {
            this.sendEmail(response.data.user_id, response.data.username, response.data.email)
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    sendEmail(userId, username, email){
        TokenDataService.findByUser(userId)
        .then(newTokenResponse => {
            console.log(newTokenResponse.data);
            TokenDataService.sendResetEmail(username, email, newTokenResponse.data.code, newTokenResponse.data.content);
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    returnToLogin(e){
        this.props.router.navigate("/login")
    }

    returnToIndex(e){
        this.props.router.navigate("/index")
    }

    render(){
        return(
            <>
            {this.state.initialLoad ?
                <>
                {!cookies.get('role') ? 
                    !this.state.submitted ?
                        <div className="submit-form">
                            {this.state.failure ?  
                                <div style={{color: "red", outline: "1px dashed red"}} className='mt-2'>
                                    <h5>ERROR</h5>
                                    <p>You must submit an email!</p>
                                </div>
                            : 
                                <Fragment></Fragment>
                            }
                            <p className='mb-3'>Please submit the email you created your account with.</p>
                            <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                required
                                value={this.state.email}
                                onChange={this.onChangeEmail}
                                onPaste={(e) => {e.preventDefault()}}
                                name="email"
                            />
                            </div>

                            <button onClick={this.submitForm} className="btn btn-success mt-3 mb-1">
                            Submit Email
                            </button><br/>
                            <button onClick={this.returnToLogin} className="btn btn-danger mt-1 mb-1">
                            Return to Login
                            </button><br/>
                        </div>
                    :
                        <div className='mt-4'>
                            <p>You have successfully submitted! If there is an account associated with that email, more information can be found in an email detailing the recovery process.</p>

                            <button onClick={this.returnToIndex} className="btn btn-success mt-2 mb-1">
                                Return to Index
                            </button><br/>
                        </div>
                    :
                    <Navigate replace to="/index" />
                }
                </>
            :
            (<>
                {this.state.networkError ?
                    (<p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>)
                :
                (<>
                    <LoadingComponent />
                    <p>Loading...</p>
                </>)
                }
            </>)
            }
            </>
        )
    }
}

export default withRouter(RecoveryForm)