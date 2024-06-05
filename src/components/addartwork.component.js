import React, {Component} from "react";
import ArtworkService from "../service/artwork.service";
import axios from "axios";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import LoadingComponent from "./loading.component";

const cookies = new Cookies();

export default class AddArtwork extends Component{
    constructor(props){
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangeReflection = this.onChangeReflection.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.saveArtwork = this.saveArtwork.bind(this);
        this.newArtwork = this.newArtwork.bind(this);
        this.getMaxCount = this.getMaxCount.bind(this);
        this.returnToList = this.returnToList.bind(this);

        this.state = {
            id: null,
            title: "",
            imagename: "",
            imagedata: "",
            month: 0,
            year: "",
            reflection: "",
            networkError: false,
            pageLoaded: false,

            submitted: false,
            count: 0,
            message: ""
        }
    };

    // On rendering, get max count
    componentDidMount() {
      this.getMaxCount();
    }

    // Get max count for new records (new records will have id of max+1)
    getMaxCount(){
      ArtworkService.findMaxID().then(response => {
        this.setState({
          count: response.data.max === null ? 0 : response.data.max,
          pageLoaded: true
        })
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          networkError: true
        })
      })
    }

    // On change
    onChangeTitle(e) {
      this.setState({
        title: e.target.value
      });
    }

    onChangeImage(e){
      const file = e.target.files[0];
      const formData = new FormData(); 
      const fileName = `uploaded_dateVal_${(Date.now()/1000).toFixed(0)}_${file.name}`;

      //FILE INFO NAME WILL BE "uploaded", the uploaded file will be "uploaded_<datestamp>_<file name>"
      formData.append('uploaded', file, fileName);
      this.setState({
        imagename: fileName,
        imagedata: formData
      });
    }

    onChangeMonth(e) {
      this.setState({
        month: e.target.value
      });
    }

    onChangeYear(e) {
      this.setState({
        year: e.target.value
      });
    }

    onChangeReflection(e) {
      this.setState({
        reflection: e.target.value
      });
    }
    
    // Save artwork
    saveArtwork() {
      var data = {
          id: this.state.count + 1,
          imagedata: this.state.imagename,
          title: this.state.title,
          month: this.state.month,
          year: this.state.year,
          reflection: this.state.reflection
      };
  
      ArtworkService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            imagedata: response.data.imagedata,
            title: response.data.title,
            month: response.data.month,
            year: response.data.year,
            reflection: response.data.reflection,
  
            submitted: true
          });

          axios.post('http://localhost:8080/image-upload', this.state.imagedata)
          .then(res => {
            console.log('Axios response: ', res)
          })
          window.scrollTo(0, 0)
          console.log(response.data);
        })
        .catch(e => {
          this.setState({
            message: "ERROR"
          })
          window.scrollTo(0, 0)
          console.log(e);
        });
    }
  
    // Reset the form if adding a new item after submitting
    newArtwork() {
      this.setState({
          id: null,
          title: "",
          imagename: "",
          imagedata: "",
          month: "",
          year: "",
          imageData: "",
          reflection: "",
          message: "",

          count: this.state.count + 1,
          submitted: false
      });
    }

    // Returning
    returnToList(){
      switch(this.state.year){
        case 2019:
          window.location = '/y1';
          break;
        case 2020:
          window.location = '/y2';
          break;
        case 2021:
          window.location = '/y3';
          break;
        case 2022:
          window.location = '/y4';
          break;
        case 2023:
          window.location = '/y5';
          break;
        case new Date().getFullYear:
          window.location = '/y6';
          break;
        default:
          window.location = '/';
          break;
      }
    }
  
    render() {
      return (
        <>
        {this.state.pageLoaded ? 
          (<>
          {cookies.get('role') === 'ADMIN' ?
            <div className="submit-form">
              {this.state.submitted ? (
                <>
                  <h4>You submitted successfully!</h4>
                  <button className="btn btn-success" onClick={this.newArtwork}>
                    Add Another Artwork
                  </button>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.returnToList}
                  >
                    Go to {this.state.year} Art
                  </button>
                </>
              ) : (
                
                <>
                {this.state.message ? 
                <div style={{color: "red", outline: "1px dashed red"}}>
                  <p style={{fontWeight: "bold"}}>The submission was unsuccessful.</p>
                  <p>Ensure the following is satisfied for a successful submission:</p>
                  <ul>
                    <li>A title is provided.</li>
                    <li>An image has been uploaded.</li>
                    <li>When uploading a file, the size is less than 50MB and is an image format (png, jpg, gif, etc.)</li>
                    <li>A month is selected.</li>
                    <li>A numerical year is input.</li>
                  </ul>
                </div>
                : 
                ""}

                  <div className="form-group mt-2">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      required
                      value={this.state.title}
                      onChange={this.onChangeTitle}
                      name="title"
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label htmlFor="imagedata">Image</label>
                    <p><b>(Ideally, the image size should be 1920x1080 or similar ratios)</b></p>
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
                <label htmlFor="month">Month</label>
                <select 
                  className="form-control" 
                  id="month"
                  onChange={this.onChangeMonth}
                  required
                  defaultValue={0}
                >
                  <option value="0" hidden>Select a month...</option>
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

                <div className="form-group mt-2">
                    <label htmlFor="year">Year</label>
                    <input
                      type="text"
                      className="form-control"
                      id="year"
                      required
                      value={this.state.year}
                      onChange={this.onChangeYear}
                      name="year"
                    />
                </div>

                <div className="form-group mt-2">
                <label htmlFor="reflection">Reflection</label>
                <textarea 
                  className="form-control"
                  id="reflection"
                  onChange={this.onChangeReflection}
                  rows="15"
                  value={this.state.reflection}
                >
                  
                </textarea>
              </div>
                
              </div>
              <br/>
                  <button onClick={this.saveArtwork} className="btn btn-success mb-3">
                    Submit
                  </button>
                </>
              )}
            </div>
            :
              <Navigate replace to="/notAuthenticated" />
            }
          </>)
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
        );
    }
  }