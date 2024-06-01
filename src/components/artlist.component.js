import React, { Component } from "react";
import ArtworkDataService from "../service/artwork.service";
import { Link } from "react-router-dom";
import '../styles.css';
import { Button, Figure, Modal, Pagination } from "react-bootstrap";

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
    this.setFirstPage = this.setFirstPage.bind(this);
    this.setLastPage = this.setLastPage.bind(this);
    this.setNextPage = this.setNextPage.bind(this);
    this.setPreviousPage = this.setPreviousPage.bind(this);

    this.state = {
      artworks: [],
      currentArtwork: null,
      currentIndex: -1,
      searchTitle: "",
      prompt: false,
      message: "",
      
      page: 1,
      pageSize: 5,
      fullCount: 0,
      pageCount: 1
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
        console.log(e);
      });

    ArtworkDataService.getAllUnpaged(year, searchTitle)
    .then((response) => {

      this.setState({
        fullCount: response.data.length,
        pageCount: Math.ceil(response.data.length/this.state.pageSize)
      })
    })
  }

  // Handler for size change
  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
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

  // Refresh lsit
  refreshList() {
    this.retrieveArtworksPaged();
    this.setState({
      currentArtwork: null,
      currentIndex: -1
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

  // Remove all artworks at once
  removeAllArtworks() {
    const year = this.props;
    ArtworkDataService.deleteAllByYear(year)
      .then(response => {
        console.log(response.data);
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
        console.log(e);
      });
  }

  // Search for an artwork by title
  searchTitle() {
    // On an empty query, return to original results
    if(!this.state.searchTitle){
      this.retrieveArtworksPaged();

      this.setState({
        inputSearch: "",
        currentIndex: -1
      })
    }
    else{
      const year = this.props;
      ArtworkDataService.getAllPaged(year, this.state.page, this.state.pageSize, this.state.searchTitle)
      .then(response => {
        this.setState({
          artworks: response.data,
          fullCount: response.data.length,
          inputSearch: this.state.searchTitle,
          currentIndex: -1
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  }

  // Paging
  setFirstPage(){
    this.setState({
      page: 1,
      currentIndex: -1
    },
    () => {
      this.retrieveArtworksPaged();
    }
    );
  }

  setPreviousPage(){
    if(this.state.page-1 >= 1){
      this.setState({
        page: this.state.page-1,
        currentIndex: -1
      },
      () => {
        this.retrieveArtworksPaged();
      }
      );
    }
  }

  setNextPage(){
    if(this.state.page + 1 <= this.state.pageCount){
      this.setState({
        page: this.state.page+1,
        currentIndex: -1
      },
      () => {
        this.retrieveArtworksPaged();
      }
      );
    }
  }

  setLastPage(){
    this.setState({
      page: Math.ceil(this.state.fullCount/this.state.pageSize),
      currentIndex: -1
    },
    () => {
      this.retrieveArtworksPaged();
    }
    );
  }

  render() {
    const { searchTitle, artworks, currentArtwork, currentIndex, pageSize, page } = this.state;
    const year = this.props;

    return (
      <div className="list row" style={{marginLeft:"100px"}}>
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
              <Pagination.First onClick={this.setFirstPage}/>
              <Pagination.Prev onClick={this.setPreviousPage}/> 
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={this.setNextPage}/>
              <Pagination.Last onClick={this.setLastPage}/>
            </Pagination>
          </div>

          {this.state.message ? <div style={{color:"green", outline: "1px green dashed"}}><p>All {year} artworks successfully deleted!</p></div>: <div></div>}
          <p>If you are unable to find a specific piece, please check another art year or try searching for its title.</p>
          <button
            className="m-3 btn btn-sm btn-primary"
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

          {this.state.inputSearch ? 
            <p>{this.state.fullCount} total results found for "{this.state.inputSearch}"</p>
            :
            <p>{this.state.fullCount} total results found</p>
          }

          <p>Page {page} of {this.state.pageCount === 0 ? 1 : this.state.pageCount}</p>
          
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.launchDeletePrompt}
          >
            Remove All
          </button>

        </div>
        <div className="col-md-6">
          {currentArtwork ? (
            <div>
              <div>
                <label>
                  <h3>{currentArtwork.title}</h3>
                </label>{" "}
              </div>
              <div>
              <Figure>
                <Figure.Image
                  alt="The image could not be found or processed."
                  src={`http://localhost:8080/uploads/${currentArtwork.imagedata}`}
                  rounded
                />
                <Figure.Caption>
                  {currentArtwork.reflection}
                </Figure.Caption>
              </Figure>
              </div>
              <div>
                <label>
                  <strong>Created:</strong>
                </label>{" "}
                {months[currentArtwork.month-1]} {currentArtwork.year}
              </div>

              <Link
                to={"/artwork/" + currentArtwork.id}
                className="badge bg-warning"
                style={{color: "black"}}
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
