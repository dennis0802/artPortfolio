import React, { Component, Fragment } from "react";
import ArtworkDataService from "../service/artwork.service";
import { Link } from "react-router-dom";
import '../styles.css';
import { Button, Figure, Image, Modal, Pagination} from "react-bootstrap";
import Cookies from "universal-cookie";
import LoadingComponent from "./loading.component";
import FeedbackForm from "./feedback.component";

const cookies = new Cookies();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class ArtList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveArtwork = this.setActiveArtwork.bind(this);
    this.removeAllArtworks = this.removeAllArtworks.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
    this.launchDeletePrompt = this.launchDeletePrompt.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.retrieveArtworksPaged = this.retrieveArtworksPaged.bind(this);
    this.setPage = this.setPage.bind(this);
    this.launchEnlarge = this.launchEnlarge.bind(this);
    this.closeEnlarge = this.closeEnlarge.bind(this);

    this.state = {
      artworks: [],
      currentArtwork: null,
      currentIndex: -1,
      searchTitle: "",
      prompt: false,
      enlarge: false,
      message: "",
      pageLoading: true,
      pageChangeLoading: false,
      networkError: false,
      
      page: 1,
      pageSize: 5,
      fullCount: 0,
      pageCount: 1,
      average: 0
    };

    this.pageSizes = [5, 10, 15];
  }

  componentDidMount() {
    this.retrieveArtworksPaged();
  }

  // Retrieve artworks through a paging model
  retrieveArtworksPaged() {
    const { searchTitle, page, pageSize } = this.state;
    const year = this.props.year;

    ArtworkDataService.getAllPaged(year, page, pageSize, searchTitle)
      .then((response) => {
        
        const artworks = response.data;

        this.setState({
          artworks: artworks,

        });

      })
      .catch((e) => {
        //console.log(e);
      });

    ArtworkDataService.getAllUnpaged(year, searchTitle)
    .then((response) => {

      this.setState({
        fullCount: response.data.length,
        pageCount: Math.ceil(response.data.length/this.state.pageSize),
        pageLoading: false,
        pageChangeLoading: false
      })
    })
    .catch((e) => {
      //console.log(e);
      this.setState({
        networkError: true
      })
    })
  }

  // Handler for size change
  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1,
        currentArtwork: null,
        currentIndex: null,
        pageChangeLoading: true
      },
      () => {
        this.retrieveArtworksPaged();
      }
    );
  }

  // Handler for title change
  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  // Redirect function
  addArtwork() {
    window.location="/addArtwork"
  }

  // Refresh list
  refreshList() {
    this.retrieveArtworksPaged();
    this.setState({
      currentArtwork: null,
      currentIndex: -1,
    });
  }

  // Set the artwork for display
  setActiveArtwork(artwork, index) {
    this.setState({
      currentArtwork: artwork,
      currentIndex: index
    });
  }

  // Launch a deletion prompt
  launchDeletePrompt(){
    this.setState({
      prompt: true
    })
  }

  // Close the deletion prompt
  closeDeletePrompt(){
    this.setState({
      prompt: false
    })
  }

  // Enlarge the image
  launchEnlarge(){
    this.setState({
      enlarge: true
    })
  }

  // Close the deletion prompt
  closeEnlarge(){
    this.setState({
      enlarge: false
    })
  }

  // Remove all artworks at once
  removeAllArtworks() {
    const year = this.props.year;
    ArtworkDataService.deleteAllByYear(year)
      .then(response => {
        //console.log(response.data);
        this.closeDeletePrompt();
        this.refreshList();
        this.setState({
          message: "All artworks successfully deleted!",
          page: 1,
          fullCount: 0,
          pageCount: 1
        })
        window.scrollTo(0,0);
      })
      .catch(e => {
        //console.log(e);
      });
  }

  // Search for an artwork by title
  searchTitle() {
    // On an empty query, return to original results
    if(!this.state.searchTitle){
      this.setState({
        pageChangeLoading: true
      })

      this.retrieveArtworksPaged();

      this.setState({
        inputSearch: "",
        currentIndex: -1,
        currentArtwork: null,
        page: 1
      })
    }
    else{
      const year = this.props.year;
      this.setState({
        pageChangeLoading: true
      })

      ArtworkDataService.getAllPaged(year, 1, this.state.pageSize, this.state.searchTitle)
      .then(response => {
        this.setState({
          artworks: response.data,
          inputSearch: this.state.searchTitle,
          currentIndex: -1,
          currentArtwork: null,
          page: 1,
          pageChangeLoading: false
        });
        //console.log(response.data);
      })
      .catch(e => {
        //console.log(e);
      });

      ArtworkDataService.getAllUnpaged(year, this.state.searchTitle)
      .then((response) => {
  
        this.setState({
          fullCount: response.data.length,
          pageCount: Math.ceil(response.data.length/this.state.pageSize)
        })
      })
      .catch(e => {
        //console.log(e);
      })
    }
  }

  // Paging
  setPage(newPage){
    if(newPage >= 1 && newPage <= this.state.pageCount){
      this.setState({
        page: newPage,
        currentIndex: -1,
        currentArtwork: null,
        pageChangeLoading: true
      },
      () => {
        this.retrieveArtworksPaged();
      }
      );
    }
  }

  render() {
    const { searchTitle, artworks, currentArtwork, currentIndex, pageSize, page } = this.state;
    const year = this.props.year;

    return (
      <>
      {!this.state.pageLoading ? 
        (<div className="list row" style={{marginLeft:"100px"}}>
          <Modal show={this.state.prompt} onHide={this.closeDeletePrompt}>
          <Modal.Header closeButton>
            <Modal.Title>Delete All {year} Artwork</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete all artwork from {year}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDeletePrompt}>
              Cancel
            </Button>
            <Button variant="danger" onClick={this.removeAllArtworks}>
              Remove All
            </Button>
          </Modal.Footer>
        </Modal>

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

            {"Items per Page: "}
            <select onChange={this.handlePageSizeChange} value={pageSize}>
              {this.pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <div className="mt-2">
              <Pagination>
                <Pagination.First onClick={() => this.setPage(1)}/>
                <Pagination.Prev onClick={() => this.setPage(this.state.page-1)}/> 
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next onClick={() => this.setPage(this.state.page+1)}/>
                <Pagination.Last onClick={() => this.setPage(this.state.pageCount)}/>
              </Pagination>
            </div>

            {this.state.message ? <div style={{color:"green", outline: "1px green dashed"}}><p>All {year} artworks successfully deleted!</p></div>: <Fragment></Fragment>}
            <p>If you are unable to find a specific piece, please check another art year or try searching for its title.</p>
            <p>Try clicking a selected artwork's image to enlarge it to view more details and feedback!</p>
            {!this.state.pageChangeLoading ?
            <>
              {cookies.get('role') === 'ADMIN' ? 
                <button
                  className="m-3 btn btn-sm btn-primary"
                  onClick={this.addArtwork}
                >
                  Add an Artwork
                </button>
              : 
                ""
              }

            <ul className="list-group mt-3">
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

            {this.state.inputSearch ? 
              <p>{this.state.fullCount} total results found for "{this.state.inputSearch}"</p>
              :
              <p>{this.state.fullCount} total results found</p>
            }

            <p>Page {page} of {this.state.pageCount === 0 ? 1 : this.state.pageCount}</p>
            
            {cookies.get('role') === 'ADMIN' ? 
              <button
                className="m-3 btn btn-sm btn-danger"
                onClick={this.launchDeletePrompt}
              >
                Remove All
              </button>
              :
              ""
            }
            </>
            :
            <>
              {this.state.networkError ?
                <p className="mt-3">There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>
              :
                <>
                  <LoadingComponent />
                </>
              }
            </>
          }
          </div>

          <div className="col-md-6">
            {currentArtwork ? (
              <Fragment>
                  <Modal show={this.state.enlarge} onHide={this.closeEnlarge} className="modal-lg">
                  <Modal.Header closeButton>
                    <Modal.Title>{currentArtwork.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="text-center">
                    <Image 
                        alt="The image could not be found or processed."
                        src={`https://localhost:8080/uploads/${currentArtwork.imagedata}`}
                        rounded
                        className="img-fluid"
                    />
                    <div className="mt-3">
                      {currentArtwork.reflection}
                    </div>
                    <div className="mt-3 mb-3">
                      <b>Created:</b> {months[currentArtwork.month-1]} {currentArtwork.year}
                    </div>

                    <h4>Feedback:</h4>
                    <div className="mt-3">
                        <div className="mt-3">
                          <FeedbackForm currentArtwork={currentArtwork}/>
                        </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={this.closeEnlarge}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Fragment>
                  <label>
                    <h3>{currentArtwork.title}</h3>
                  </label>{" "}
                </Fragment>
                <Fragment>
                <Figure>
                  <Figure.Image
                    alt="The image could not be found or processed."
                    src={`https://localhost:8080/uploads/${currentArtwork.imagedata}`}
                    onClick={this.launchEnlarge}
                    rounded
                  />
                  <Figure.Caption>
                    {currentArtwork.reflection}
                  </Figure.Caption>
                </Figure>
                </Fragment>
                <Fragment>
                  <label>
                    <strong>Created:</strong>
                  </label>{" "}
                  {months[currentArtwork.month-1]} {currentArtwork.year}
                </Fragment>
                <br/>

                {cookies.get('role') === 'ADMIN' ? 
                  <Link
                    to={"/artwork/" + currentArtwork.id}
                    className="badge bg-warning mb-3"
                    style={{color: "black"}}
                  >
                    Edit
                  </Link>
                :
                  ""
                }
              </Fragment>
            ) : (
              <Fragment>
                <br />
                <p>Please click on a Artwork...</p>
              </Fragment>
            )}
          </div>
        </div>)
        :
        (<div>
          
          {this.state.networkError ?
            (<p>There has been a network error connecting to the server. Please refresh or try again later. If the issue persists, please contact the administrator.</p>)
          :
            (<>
              <LoadingComponent />
              <p>Loading...</p>
            </>)
          }
        </div>)
        }
      </>
    );
  }
}
