import { Component } from 'react';
import { withRouter } from '../common/with-router';
import FeedbackDataService from '../service/feedback.service';
import TokenDataService from '../service/token.service';
import UserDataService from '../service/user.service';
import Cookies from 'universal-cookie';
import { Button, Modal, Table } from 'react-bootstrap';

const cookies = new Cookies();

class FeedbackForm extends Component{
    constructor(props){
        super(props);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onChangeRating = this.onChangeRating.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.newComment = this.newComment.bind(this);
        this.findMaxID = this.findMaxID.bind(this);
        this.findAverageRating = this.findAverageRating.bind(this);
        this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
        this.deletePrompt = this.deletePrompt.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.getFeedbackByArt = this.getFeedbackByArt.bind(this);
        this.getFeedbackByID = this.getFeedbackByID.bind(this);
        this.cancelCommentChanges = this.cancelCommentChanges.bind(this);
        this.onChangeExistingComment = this.onChangeExistingComment.bind(this);
        this.onChangeExistingRating = this.onChangeExistingRating.bind(this);
        this.submitCommentChanges = this.submitCommentChanges.bind(this);
        this.checkJWT = this.checkJWT.bind(this);

        this.state = {
            comment: "",
            rating: 0,
            feedbackError: false,
            networkError: false,
            submitted: false,
            count: 0,
            userSubmitting: -1,
            currentArtwork: this.props.currentArtwork,

            allFeedback: [],
            users: [],
            average: 0,
            deleting: false,
            target: 0,
            editing: false,
            targetFeedback: {
                id: null,
                user_id: null,
                art_id: null,
                rating: "",
                comment: "",
            },
            editingError: false,
            loggedIn: false
        }
    }

    componentDidMount(){
        this.findMaxID();
        this.getFeedbackByArt();
        this.getUsers();
        this.findAverageRating();
        this.checkJWT();
    }

    checkJWT(){
        TokenDataService.decodeJWT(cookies.get('session'))
        .then(response =>{
          this.setState({
            loggedIn: response.data.role === 'ADMIN' || response.data.role === 'USER',
            userSubmitting: response.data.user_id
          })
        })
        .catch(e => {

        })
    }

    findMaxID(){
        FeedbackDataService.findMaxID()
        .then(response => {
            this.setState({
                count: response.data.max === null ? 0 : response.data.max
            })
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    findAverageRating(){
        FeedbackDataService.findAvgRating(this.state.currentArtwork.id)
        .then(response =>{
            this.setState({
                average: response.data.avg
            })
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    onChangeComment(e){
        this.setState({
            comment: e.target.value
        })
    }

    onChangeRating(e){
        this.setState({
            rating: e.target.value
        })
    }

    submitComment(e){
        var feedback = {
            id: this.state.count + 1,
            user_id: this.state.userSubmitting,
            art_id: this.state.currentArtwork.id,
            rating: this.state.rating,
            comment: this.state.comment
        }

        FeedbackDataService.create(feedback)
        .then(response => {
            //console.log(response);
            this.setState({
                submitted: true
            })

            this.findMaxID();
            this.getFeedbackByArt();
            this.getUsers();
            this.findAverageRating();
        })
        .catch(e => {
            //console.log(e);
            this.setState({
                submitted: false,
                editing: false,
                feedbackError: true
            })
        })
    }

    newComment(e){
        this.setState({
            comment: "",
            rating: 0,
            feedbackError: false,
            submitted: false,
            editing: false
        })
    }

    getFeedbackByArt(){
        FeedbackDataService.findByArtID(this.state.currentArtwork.id)
        .then(response => {
            this.setState({
                allFeedback: response.data
            })
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    getUsers(){
        UserDataService.getAllUnpaged("")
        .then(response => {
            this.setState({
                users: response.data
            })
        })
        .catch(e => {
            this.setState({
                networkError: true
            })
        })
    }

    deletePrompt(id){
        //console.log(id);
        this.setState({
            target: id,
            deleting: true
        })
        this.newComment();
    }

    closeDeletePrompt(){
        this.setState({
            deleting: false
        })
    }

    getFeedbackByID(id){
        FeedbackDataService.findByID(id)
        .then(response => {
            this.setState({
                targetFeedback: response.data
            })
        })
    }

    editComment(id){
        this.setState({
            target: id,
            editing: true,
            feedbackError: false
        })

        this.getFeedbackByID(id);
    }

    deleteComment(){
        FeedbackDataService.delete(this.state.target)
        .then(response => {
            this.setState({
                target: -1,
                deleting: false,
            })
            this.findMaxID();
            this.getFeedbackByArt();
            this.getUsers();
            this.findAverageRating();
        })
        .catch(e => {

        })
    }

    cancelCommentChanges(){
        this.setState({
            targetFeedback: {
                id: null,
                user_id: null,
                art_id: null,
                rating: "",
                comment: "",
            },
            target: null,
            editing: false
        })
    }

    submitCommentChanges(){
        FeedbackDataService.update(this.state.targetFeedback.id, this.state.targetFeedback)
        .then(response => {
            this.setState({
                targetFeedback: {
                    id: null,
                    user_id: null,
                    art_id: null,
                    rating: "",
                    comment: "",
                },
                target: null,
                editing: false
            })

            this.getFeedbackByArt();
        })
        .catch(e => {
            this.setState({
                editingError: true
            })
        })
    }

    onChangeExistingRating(e) {
        const rating = e.target.value;
    
        this.setState(function(prevState) {
          return {
            targetFeedback: {
              ...prevState.targetFeedback,
              rating: rating
            }
          };
        });
    }

    onChangeExistingComment(e) {
        const comment = e.target.value;
    
        this.setState(function(prevState) {
          return {
            targetFeedback: {
              ...prevState.targetFeedback,
              comment: comment
            }
          };
        });
    }

    render(){
        const {allFeedback, average, targetFeedback } = this.state;
        const rounded = Math.round(average * 100) / 100;

        return(
            <>
                {!this.state.networkError ?
                (<>
                    <p><b>Average Rating: {average ? rounded + "/5" : "No ratings available"}</b></p>
                    {!this.state.submitted ?
                    <>
                    {this.state.loggedIn ?
                        <>
                            {this.state.feedbackError ? 
                                <div style={{color: "red", outline: "1px dashed red"}}>
                                    <p style={{fontWeight: "bold"}}>The comment could not be submitted.</p>
                                    <p>Ensure that you have given a numerical rating for the artwork. Comments are optional.</p>
                                </div>
                            : 
                                ""
                            }
                            <div className="submit-form">
                                <div className="form-group mt-2">
                                    <label htmlFor="rating">Rating (/5)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="rating"
                                        required
                                        value={this.state.rating}
                                        onChange={this.onChangeRating}
                                        onPaste={(e) => {e.preventDefault()}}
                                        name="rating"
                                        min={1}
                                        max={5}
                                        style={{textAlign: 'center'}}
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="comment">Comments</label>
                                    <textarea 
                                        className="form-control"
                                        id="comment"
                                        onChange={this.onChangeComment}
                                        rows="5"
                                        value={this.state.comment}
                                    >
                                    </textarea>
                                </div>

                                <div className="col-md-6">
                                <>
                                    <Modal show={this.state.deleting} onHide={this.closeDeletePrompt} className="modal-lg">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Delete Comment</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Are you sure you want to delete your comment?<br/>
                                        <Button variant="danger" onClick={this.deleteComment} className='mt-2'>
                                        Delete
                                        </Button><br/>
                                        <Button variant="info" onClick={this.closeDeletePrompt} className='mt-2'>
                                        Close
                                        </Button>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="info" onClick={this.closeDeletePrompt}>
                                        Close
                                        </Button>
                                    </Modal.Footer>
                                    </Modal>
                                </>
                            </div>

                                <button onClick={this.submitComment} className="btn btn-success mt-3 mb-3">
                                    Submit
                                </button>
                            </div>
                        </>
                        :
                            <>
                                <p>You must be logged in to submit feedback.</p><br/>
                            </>
                        }
                    </>
                    :
                        <>
                            <p>Feedback submitted!</p>
                            <button className="btn btn-success mb-3" onClick={this.newComment}>
                                Add Another Comment
                            </button>
                        </>
                    }
                    
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allFeedback.length !== 0 ? allFeedback &&
                            allFeedback.map((feedback, index) => (   
                            <tr key={feedback.id}>
                                <td key={feedback.user_id}>{this.state.users.filter(u => u.user_id === feedback.user_id)[0] ? this.state.users.filter(u => u.user_id === feedback.user_id)[0].username : ""}</td>
                                <td>{feedback.rating}/5</td>
                                <td>{feedback.comment ? feedback.comment : "No comment"}</td>
                                
                                <>
                                    {this.state.userSubmitting === feedback.user_id ? // Does the feedback belong to the current logged in user?
                                    <>
                                        <td>                            
                                            <button className="btn btn-success btn-sm" onClick={() => {this.editComment(feedback.id)}}>
                                                Edit
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success btn-sm" onClick={() => {this.deletePrompt(feedback.id)}}>
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td></td>
                                        <td></td>
                                    </>
                                    }
                                </>
                            </tr>

                            )) : <tr><td colSpan={5}>No feedback found.</td></tr>
                            }
                        </tbody>
                    </Table>
                    <>
                        {this.state.editing && targetFeedback ?
                        <>
                            <h3>Editing Comment</h3>
                            {this.state.edtingError ? 
                                <div style={{color: "red", outline: "1px dashed red"}}>
                                    <p style={{fontWeight: "bold"}}>The comment could not be submitted.</p>
                                    <p>Ensure that you have given a numerical rating for the artwork. Comments are optional.</p>
                                </div>
                            : 
                                ""
                            }
                            <div className="submit-form">
                                <div className="form-group mt-2">
                                    <label htmlFor="rating">Rating (/5)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="rating"
                                        required
                                        value={targetFeedback.rating}
                                        onChange={this.onChangeExistingRating}
                                        onPaste={(e) => {e.preventDefault()}}
                                        name="rating"
                                        min={1}
                                        max={5}
                                        style={{textAlign: 'center'}}
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="comment">Comments</label>
                                    <textarea 
                                        className="form-control"
                                        id="comment"
                                        onChange={this.onChangeExistingComment}
                                        rows="5"
                                        value={targetFeedback.comment}
                                    >
                                    </textarea>
                                </div>

                                <button onClick={this.submitCommentChanges} className="btn btn-success mt-3 mb-2">
                                    Save Changes
                                </button><br/>

                                <button onClick={this.cancelCommentChanges} className="btn btn-danger mt-2 mb-3">
                                    Cancel
                                </button>
                            </div>
                        </>
                        :
                            ""
                        }
                    </>
                </>)
                :
                    <p className="mt-3">
                        There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.
                    </p>
                }
            </>
        )
    }
}

export default withRouter(FeedbackForm)