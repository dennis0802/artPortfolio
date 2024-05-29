import React, { Component } from "react";
import ArtworkDataService from "../service/artwork.service";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import '../styles.css';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export type CounterProps = { label?: string };
export default class ArtList extends Component<CounterProps> {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveArtworks = this.retrieveArtworks.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveArtwork = this.setActiveArtwork.bind(this);
    this.removeAllArtworks = this.removeAllArtworks.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      artworks: [],
      currentArtwork: null,
      currentIndex: -1,
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.retrieveArtworks();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveArtworks() {
    const { year = new Date().getFullYear()} = this.props;
    ArtworkDataService.findByYear(year)
      .then(response => {
        this.setState({
          artworks: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  addArtwork() {
    window.location="/addArtwork"
  }

  refreshList() {
    this.retrieveArtworks();
    this.setState({
      currentArtwork: null,
      currentIndex: -1
    });
  }

  setActiveArtwork(artwork, index) {
    this.setState({
      currentArtwork: artwork,
      currentIndex: index
    });
  }

  removeAllArtworks() {
    const { year = new Date().getFullYear()} = this.props;
    ArtworkDataService.deleteAllByYear(year)
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    // On an empty query, return to original results
    if(!this.state.searchTitle){
      this.retrieveArtworks();
    }
    else{
      ArtworkDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          artworks: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  }

  render() {
    const { searchTitle, artworks, currentArtwork, currentIndex } = this.state;

    return (
      <div className="list row" style={{marginLeft:"100px"}}>
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Artworks List</h4>
          <p>If you are unable to find a specific piece, please check another art year or try searching for its title.</p>
          <button
            className="m-3 btn btn-sm btn-info"
            onClick={this.addArtwork}
          >
            Add an Artwork
          </button>

          <ul className="list-group">
            {artworks.length !== 0 ? artworks &&
              artworks.map((artwork, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveArtwork(artwork, index)}
                  key={artwork.id}
                >
                  {artwork.title}
                </li>
              )) : <li style={{listStyleType: "none"}}>No artworks found. Try a different title.</li>
              }
          </ul>

          <p>{artworks.length} results found.</p>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllArtworks}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentArtwork ? (
            <div>
              <h4>Artwork</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentArtwork.title}
              </div>
              <div>
                <label>
                  <strong>Image Data:</strong>
                </label>{" "}<br/>
                <Image src={`http://localhost:8080/uploads/${currentArtwork.imagedata}`} id="listDisplay" rounded alt="The image could not be found or processed."/>
              </div>
              <div>
                <label>
                  <strong>Month:</strong>
                </label>{" "}
                {months[currentArtwork.month-1]}
              </div>
              <div>
                <label>
                  <strong>Year:</strong>
                </label>{" "}
                {currentArtwork.year}
              </div>
              <div>
                <label>
                  <strong>Reflection:</strong>
                </label>{" "}
                {currentArtwork.reflection}
              </div>
              <Link
                to={"/artwork/" + currentArtwork.id}
                className="badge bg-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Artwork...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
