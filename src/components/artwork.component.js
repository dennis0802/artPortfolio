import React, { Component, Fragment } from "react";
import ArtworkDataService from "../service/artwork.service";
import { withRouter } from '../common/with-router';
import Image from "react-bootstrap/Image";
import axios from "axios";
import '../styles.css';
import { Button, Modal } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import LoadingComponent from "./loading.component";
import FeedbackDataService from "../service/feedback.service";

const cookies = new Cookies();

class Artwork extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeReflection = this.onChangeReflection.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.getArtwork = this.getArtwork.bind(this);
    this.updateArtwork = this.updateArtwork.bind(this);
    this.deleteArtwork = this.deleteArtwork.bind(this);
    this.onChangeImage = this.onChangeImage.bind(this);
    this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
    this.launchDeletePrompt = this.launchDeletePrompt.bind(this);
    this.returnToList = this.returnToList.bind(this);
    this.postDeletionComment = this.postDeletionComment.bind(this);

    this.state = {
      currentArtwork: {
        id: null,
        title: "",
        month: "",
        year: "",
        imagedata: "",
        reflection: "",
        file: null

      },
      oldArtwork: "",
      newName: "",
      prompt: false,
      error: false,
      success: false,
      yearToReturnTo: "",
      pageLoaded: false,
      networkError: false
    };
  }

  componentDidMount() {
    //console.log(this.props.router.params.id);
    this.getArtwork(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentArtwork: {
          ...prevState.currentArtwork,
          title: title
        }
      };
    });
  }

  onChangeImage(e){
    const file = e.target.files[0];
    const formData = new FormData(); 
    const fileName = `uploaded_dateVal_${(Date.now()/1000).toFixed(0)}_${file.name}`;

    //FILE INFO NAME WILL BE "uploaded", the uploaded file will be "uploaded_<datestamp>_<file name>"
    formData.append('uploaded', file, fileName);
    //console.log(formData.get('uploaded'));

    this.setState(function(prevState) {
      return{
        currentArtwork:{
          ...prevState.currentArtwork,
          imagedata: fileName,
          file: formData
        },
        newName: fileName
      }
    });
  }

  onChangeMonth(e) {
    const month = e.target.value;

    this.setState(function(prevState) {
      return {
        currentArtwork: {
          ...prevState.currentArtwork,
          month: month
        }
      };
    });
  }

  onChangeYear(e) {
    const year = e.target.value;

    this.setState(function(prevState) {
      return {
        currentArtwork: {
          ...prevState.currentArtwork,
          year: year
        }
      };
    });
  }

  onChangeReflection(e) {
    const reflection = e.target.value;
    
    this.setState(prevState => ({
      currentArtwork: {
        ...prevState.currentArtwork,
        reflection: reflection
      }
    }));
  }

  getArtwork(id) {
    ArtworkDataService.get(id)
      .then(response => {
        this.setState({
          currentArtwork: response.data,
          oldArtwork: response.data.imagedata,
          newName: response.data.imagedata,
          yearToReturnTo: response.data.year,
          pageLoaded: true
        });

        //console.log(response.data);
      })
      .catch(e => {
        this.setState({
          networkError: true
        })
        //console.log(e);
      });
  }

  updateArtwork() {
    ArtworkDataService.update(
      this.state.currentArtwork.id,
      this.state.currentArtwork
    )
      .then(response => {
        //console.log(response.data);
        this.setState({
          error: false,
          success: true,
          yearToReturnTo: response.data.year
        });
        window.scrollTo(0, 0)

        // Image changed
        if(this.state.newName !== this.state.oldArtwork){
          axios.post('https://localhost:8080/image-upload', this.state.currentArtwork.file)
          .then(res => {
            //console.log('Axios response: ', res)
          })

          axios.post('https://localhost:8080/image-delete',{
            value: this.state.oldArtwork
          })
          .then(res => {
            //console.log('Axios response: ' + res);
          })
        }

        this.getArtwork(this.props.router.params.id);

      })
      .catch(e => {
        this.setState({
          error: true,
          success: false
        })
        window.scrollTo(0, 0)
        //console.log(e);
      });
  }

  returnToList(){
    switch(this.state.yearToReturnTo){
      case 2019:
        this.props.router.navigate('/y1');
        break;
      case 2020:
        this.props.router.navigate('/y2');
        break;
      case 2021:
        this.props.router.navigate('/y3');
        break;
      case 2022:
        this.props.router.navigate('/y4');
        break;
      case 2023:
        this.props.router.navigate('/y5');
        break;
      case new Date().getFullYear():
        this.props.router.navigate('/y6');
        break;
      default:
        this.props.router.navigate('/');
        break;
    }
  }

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

  deleteArtwork() {
    axios.post('https://localhost:8080/image-delete',{
      value: this.state.oldArtwork
    })

    FeedbackDataService.deleteByArt(this.state.currentArtwork.id)
    .then(response => {
      //console.log(response);
      this.postDeletionComment();
    })
  }

  postDeletionComment(){
    ArtworkDataService.delete(this.state.currentArtwork.id)
    .then(response => {
      //console.log(response.data);
      this.closeDeletePrompt();
      this.returnToList();
    })
    .catch(e => {
      //console.log(e);
    });
  }

  render() {
    const { currentArtwork } = this.state;

    return (
      <>
        {this.state.pageLoaded ?
        (<>
          {cookies.get('role') === 'ADMIN' ?
          <div>
            {currentArtwork ? (
              <div className="edit-form">

                {this.state.success ?  
                  (<div style={{color: "green", outline: "1px dashed green"}}>
                    <p>The artwork was successfully updated!</p>
                  </div>)
                : 
                  (<Fragment></Fragment>)
                }

                {this.state.error ?  
                  <div style={{color: "red", outline: "1px dashed red"}}>
                    <p>The artwork could not be updated. Ensure for a successful update:</p>
                    <ul>
                      <li>A title is provided.</li>
                      <li>An image has been uploaded.</li>
                      <li>When uploading a file, the size is less than 50MB and is an image format (png, jpg, gif, etc.)</li>
                      <li>A month is selected.</li>
                      <li>A numerical year is input.</li>
                    </ul>
                  </div>
                : 
                  <Fragment></Fragment>
                }

              <Modal show={this.state.prompt} onHide={this.closeDeletePrompt}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Artwork</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete artwork {currentArtwork.title}?</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeDeletePrompt}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={this.deleteArtwork}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>

                <h4>{currentArtwork.title}</h4>
                <button
                  className="badge bg-primary mr-2"
                  onClick={this.returnToList}
                >
                  Return to {this.state.yearToReturnTo} Art
                </button>
                <form>
                  <div className="form-group mt-2">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={currentArtwork.title}
                      onChange={this.onChangeTitle}
                    />
                  </div>

                  <div className="form-group mt-2" >
                      <label htmlFor="imagedata">Image:</label>
                      <p><b>(Ideally, the image size should be 1920x1080 or similar ratios)</b></p>
                      <p>Currently: {this.state.oldArtwork}</p>
                      <p><b>NOTE: Leave the image field blank if you do not want to change the image.</b></p>
                      <Image 
                        src={`https://localhost:8080/uploads/${this.state.oldArtwork}`} 
                        rounded 
                        alt="The image could not be found or processed."
                        className="mb-3"
                        fluid
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="imagedata"
                        required
                        onChange={this.onChangeImage}

                        name="imagedata"
                      />
                    </div>

                  <div className="form-group mt-2">
                    <label htmlFor="month">Month Created</label>
                    <select 
                      className="form-control" 
                      id="month"
                      value={currentArtwork.month}
                      onChange={this.onChangeMonth}
                    >
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="year">Year Created</label>
                    <input
                      type="text"
                      className="form-control"
                      id="year"
                      value={currentArtwork.year}
                      onChange={this.onChangeYear}
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label htmlFor="reflection">Reflection</label>
                    <textarea 
                      className="form-control"
                      id="reflection"
                      onChange={this.onChangeReflection}
                      rows="15"
                      value={currentArtwork.reflection}
                    >
                      
                    </textarea>
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
                  onClick={this.updateArtwork}
                >
                  Update
                </button>
              </div>
            ) : (
              <Fragment>
                <br />
                <p>Please click on a Artwork...</p>
              </Fragment>
            )}
          </div>
          :
            <Navigate replace to="/notAuthenticated" />
          }
        </>)
        :
        (<>
          {this.state.networkError ?
            <p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>
            :
            <>
                <LoadingComponent />
                <p>Loading...</p>
            </>
          }
        </>)
        }
      </>
    );
  }
}

export default withRouter(Artwork);
