import { Component, Fragment } from 'react';
import { withRouter } from '../common/with-router';
import Cookies from "universal-cookie"
import { Navigate } from 'react-router-dom';
import UserDataService from '../service/user.service';

const cookies = new Cookies();

class RecoveryForm extends Component{
    constructor(props){
        super(props);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.returnToLogin = this.returnToLogin.bind(this);
        this.returnToIndex = this.returnToIndex.bind(this);

        this.state = {
            email: "",
            failure: false,
            submitted: false
        }
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    submitForm(e){
        console.log("Create a token here and email it");
        UserDataService.getByEmail(this.state.email)
        .then(response => {
            console.log(response.data);
            this.setState({
                failure: false,
                submitted: true
            })

            console.log("This is where I would send an email to the submitted email if it exists")
            if(response.data[0] !== undefined){
                console.log("Someone has that email.")
            }
            else{
                console.log("No one with that email exists")
            }
        })
        .catch(e =>{
            this.setState({
                failure: true
            })
            console.log(e);
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
                            <div className="form-group">
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
        )
    }
}

export default withRouter(RecoveryForm)