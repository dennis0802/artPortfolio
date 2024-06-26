import { Component, Fragment } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import UserDataService from '../service/user.service';
import TokenDataService from '../service/token.service';
import StatusDataService from '../service/status.service';
import FeedbackDataService from '../service/feedback.service';
import LoadingComponent from './loading.component';

const cookies = new Cookies();

class Account extends Component{
    constructor(props){
        super(props);
        this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
        this.launchDeletePrompt = this.launchDeletePrompt.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.deleteUserToken = this.deleteUserToken.bind(this);
        this.deleteUserComments = this.deleteUserComments.bind(this);
        this.deleteUserStatus = this.deleteUserStatus.bind(this);
        this.logout = this.logout.bind(this);
        this.checkJWT = this.checkJWT.bind(this);
        this.setJWT = this.setJWT.bind(this);

        this.state = {
            currentUser: {
                user_id: null,
                username: "",
                password: "",
                passwordConfirm: "",
                email: "",
                role: "",
                created_at: null,
                last_login: null,
            },
            success: false,
            uniqueFailure: false,
            failure: false,
            oldUsername: "",
            prompt: false,
            password: "",
            passwordConfirm: "",
            loggedIn: true,
            load: false,
        }
    }

    componentDidMount(){
        this.checkJWT();
    }

    checkJWT(){
      TokenDataService.decodeJWT(cookies.get('session'))
      .then(response =>{
        this.setState({
          loggedIn: response.data.role === 'ADMIN' || response.data.role === 'USER',
          currentUser: response.data,
          oldUsername: response.data.username,
          oldEmail: response.data.email,
          load: true
        })
      })
      .catch(e => {
        
      })
    }

    // Prompt
    launchDeletePrompt(){
        this.setState({
            prompt: true
        })
    }

    closeDeletePrompt(){
        this.setState({
            prompt: false
        })
    }

    // Handlers
    onChangeUsername(e){
        const username = e.target.value;

        this.setState(function(prevState) {
          return {
            currentUser: {
              ...prevState.currentUser,
              username: username
            }
          };
        });
    }

    onChangePassword(e){
        const password = e.target.value;

        this.setState({
            password: password
        })
    }

    onChangePasswordConfirm(e){
        const passwordConfirm = e.target.value;

        this.setState({
            passwordConfirm: passwordConfirm
        })
    }

    onChangeEmail(e){
        const email = e.target.value;

        this.setState(function(prevState) {
          return {
            currentUser: {
              ...prevState.currentUser,
              email: email
            }
          };
        });
    }

    updateUser(){
        // If changing password, both fields must be filled (not one and nothing)
        if((this.state.password && !this.state.passwordConfirm) || (!this.state.password && this.state.passwordConfirm)){
            this.setState({
                failure: true
            })
        }

        // Check for uniqueness (and ensure it isn't flagging errors on itself)
        UserDataService.getByUsername(this.state.currentUser.username)
        .then(response => {
            if(response.data.length !== 0 && response.data.username !== this.state.oldUsername){
                this.setState({
                    failure: true,
                    uniqueFailure: true
                })
            }
        })
        .catch(e =>{
            this.setState({
                failure: true
            })
            //console.log(e);
        })

        UserDataService.getByEmail(this.state.currentUser.email)
        .then(response => {
            if(response.data.length !== 0 && response.data.email !== this.state.oldEmail){
                this.setState({
                    failure: true,
                    uniqueFailure: true
                })
            }
        })
        .catch(e =>{
            this.setState({
                failure: true
            })
            //console.log(e);
        })

        if(!this.state.failure){
            var data;
            if(this.state.password){
                data = {
                    user_id: this.state.currentUser.user_id,
                    username: this.state.currentUser.username,
                    password: this.state.password,
                    passwordConfirm: this.state.passwordConfirm,
                    email: this.state.currentUser.email,
                    role: this.state.currentUser.role,
                    created_at: this.state.currentUser.created_at,
                    last_login: this.state.currentUser.last_login
                }
            }
            else{
                data = {
                    user_id: this.state.currentUser.user_id,
                    username: this.state.currentUser.username,
                    password: this.state.currentUser.password,
                    passwordConfirm: "",
                    email: this.state.currentUser.email,
                    role: this.state.currentUser.role,
                    created_at: this.state.currentUser.created_at,
                    last_login: this.state.currentUser.last_login
                }
            }

            UserDataService.update(this.state.oldUsername, data)
            .then(response => {
                //console.log(response);
                // If username has changed, login session changes accordingly.
                if(this.state.oldUsername !== this.state.currentUser.username){
                    this.setJWT(response.data);
                }

                this.setState({
                    success: true,
                    failure: false,
                    uniqueFailure: false,
                    password: "",
                    passwordConfirm: "",
                    oldUsername: this.state.currentUser.username,
                    oldEmail: this.state.currentUser.email
                })
                window.scrollTo(0,0);
            })
            .catch(e => {
              this.setState({
                failure: true,
                success: false
              })
                //console.log(e);
            })
        }
        else{
            window.scrollTo(0,0);
        }
    }

    setJWT(data){
      TokenDataService.createJWT(data)
      .then(responseJWT => {
          cookies.set("session", responseJWT, {path: "/", maxAge: 10800, sameSite: "strict", secure: true})
      })
      .catch(e =>{
          //console.log(e);
      })
    }

    deleteAccount(){
        this.deleteUserToken();
    }

    deleteUserToken(){
      TokenDataService.delete(this.state.currentUser.user_id)
      .then(resp => {
        this.deleteUserStatus();
      })
      .catch(e => {
        //console.log(e);
      });
    }

    deleteUserStatus(){
      StatusDataService.delete(this.state.currentUser.user_id)
      .then(resp => {
        this.deleteUserComments();
      })
      .catch(e => {
        //console.log(e);
      })
    }

    deleteUserComments(){
      FeedbackDataService.deleteByUser(this.state.currentUser.user_id)
      .then(resp => {
        this.logout();
      })
      .catch(e => {
        //console.log(e);
      })
    }

    logout(){
      const currentSession = cookies.get('session')

      this.closeDeletePrompt();
      cookies.remove("session", currentSession, {path: "/", maxAge: 10800, sameSite: "strict", secure: true})
      this.propts.router.navigate("/")
    }

    render(){
        const { currentUser } = this.state;

        return(
        <>
        {this.state.load ?
          <>
          {this.state.loggedIn ?
          (<div>
            {currentUser ? (
              <div className="edit-form">

                {this.state.success ?  
                  <div style={{color: "green", outline: "1px dashed green"}}>
                    <p>Your account was successfully updated!</p>
                  </div>
                : 
                  <Fragment></Fragment>
                }

                {this.state.failure ?  
                  <div style={{color: "red", outline: "1px dashed red"}}>
                    <p>Your account could not be updated. Ensure for a successful update:</p>
                    <ul>
                      <li>Usernames should be composed of only alphabetical and numerical characters.</li>
                      <li>Submit a valid email.</li>
                      <li>If changing your password, both fields are filled and follows the guidelines below.</li>
                      {this.state.uniqueFailure ? <li>The submitted email or username has already been used. Please submit a different one.</li>: ""}
                    </ul>
                  </div>
                : 
                  <Fragment></Fragment>
                }

              <Modal show={this.state.prompt} onHide={this.closeDeletePrompt}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account? This cannot be undone.</Modal.Body>
                <Modal.Footer>
                  {this.state.oldUsername !== 'rootUser' ?
                      <>
                          <Button variant="secondary" onClick={this.closeDeletePrompt}>
                          Cancel
                          </Button>
                          <Button variant="danger" onClick={this.deleteAccount}>
                          Delete
                          </Button>
                      </>
                  :
                      <p>You cannot delete the root user account.</p>
                  }
                </Modal.Footer>
              </Modal>

                <h4>{this.state.oldUsername}</h4>
                <form>
                  <div className="form-group mt-2">
                    <label htmlFor="username">Username</label>
                    <div style={{fontWeight: "bold"}}>
                      <p>Your username must:</p>
                          <ul>
                              <li>Be composed of only numerical and alphabetical characters.</li>
                              {this.state.oldUsername === 'rootUser' ? <li>NOTE: You cannot change the root user's username.</li> : ""}
                          </ul>
                      </div>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={currentUser.username}
                      onChange={this.onChangeUsername}
                      disabled={this.state.oldUsername === 'rootUser'}
                      onPaste={(e) => {e.preventDefault()}}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="password">New Password</label>
                    <div style={{fontWeight: "bold"}}>
                      <p>Your password must:</p>
                          <ul>
                              <li>Have 1 uppercase letter and 1 lowercase letter.</li>
                              <li>Have 1 numerical character and 1 special character.</li>
                              <li>Be at least 8 characters long.</li>
                              <li>If you DO NOT WANT TO CHANGE your password, leave the fields blank.</li>
                          </ul>
                      </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={this.state.password}
                      onChange={this.onChangePassword}
                      onPaste={(e) => {e.preventDefault()}}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="passwordConfirm">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordConfirm"
                      value={this.state.passwordConfirm}
                      onChange={this.onChangePasswordConfirm}
                      onPaste={(e) => {e.preventDefault()}}
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
                      value={currentUser.email}
                      onChange={this.onChangeEmail}
                      onPaste={(e) => {e.preventDefault()}}
                    />
                  </div>
                  
                  <div className="form-group mt-2">
                      <h5>Created (in UTC)</h5>
                      <p>{new Date(Date.parse(currentUser.created_at)).toUTCString()}</p>
                  </div>

                  <div className="form-group mt-2">
                      <h5>Last Login (in UTC)</h5>
                      <p>{new Date(Date.parse(currentUser.last_login)).toUTCString()}</p>
                  </div>
                  
                </form>
                <br/>

                <button
                  className="badge bg-danger mr-2 mb-3"
                  onClick={this.launchDeletePrompt}
                >
                  Delete
                </button>

                <button
                  type="submit"
                  className="badge bg-success mb-3"
                  onClick={this.updateUser}
                >
                  Update
                </button>
              </div>
            ) : (
              <Fragment>
                <br />
                <p>Please click on a User..</p>
              </Fragment>
            )}
          </div>)
          :
            <Navigate replace to="/notAuthenticated" />
          }
        </>
        :
          <>
          {this.state.networkError ?
            (<p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>)
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

export default withRouter(Account)