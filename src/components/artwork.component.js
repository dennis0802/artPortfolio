import React, { Component } from "react";
import ArtworkDataService from "../service/artwork.service";
import { withRouter } from '../common/with-router';
import Image from "react-bootstrap/Image";
import axios from "axios";
import '../styles.css';

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
      message: ""
    };
  }

  componentDidMount() {
    console.log(this.props.router.params.id);
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
    console.log(formData.get('uploaded'));

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
          newName: response.data.imagedata
        });

        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateArtwork() {
    ArtworkDataService.update(
      this.state.currentArtwork.id,
      this.state.currentArtwork
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The artwork was updated successfully!"
        });

        // Image changed
        if(this.state.newName !== this.state.oldArtwork){
          axios.post('http://localhost:8080/image-upload', this.state.currentArtwork.file)
          .then(res => {
            console.log('Axios response: ', res)
          })

          axios.post('http://localhost:8080/image-delete',{
            value: this.state.oldArtwork
          })
          .then(res => {
            console.log('Axios response: ' + res);
          })
        }

        this.getArtwork(this.props.router.params.id);

      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteArtwork() {
    axios.post('http://localhost:8080/image-delete',{
      value: this.state.oldArtwork
    })

    ArtworkDataService.delete(this.state.currentArtwork.id)
      .then(response => {
        console.log(response.data);
        this.props.router.navigate('/artwork');
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentArtwork } = this.state;
    console.log(this.state.newName + "; " + this.state.oldArtwork)

    return (
      <div>
        {currentArtwork ? (
          <div className="edit-form">
            <h4>Artpiece: {currentArtwork.title}</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentArtwork.title}
                  onChange={this.onChangeTitle}
                />
              </div>

              <div className="form-group" >
                  <label htmlFor="imagedata">Current Image:</label>
                  <p><b>(Ideally, the image size should be 1920x1080 or similar ratios)</b></p>
                  <p>{this.state.oldArtwork}</p>
                  <Image src={`http://localhost:8080/uploads/${this.state.oldArtwork}`} id="editDisplay" rounded alt="The image could not be found or processed."/><br/><br/>
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

              <div className="form-group">
                <label htmlFor="month">Month</label>
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
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="text"
                  className="form-control"
                  id="year"
                  value={currentArtwork.year}
                  onChange={this.onChangeYear}
                />
              </div>
              <div className="form-group">
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
              className="badge bg-danger mr-2"
              onClick={this.deleteArtwork}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge bg-success"
              onClick={this.updateArtwork}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Artwork...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Artwork);
