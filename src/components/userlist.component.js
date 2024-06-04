import React, { Component, Fragment } from "react";
import UserDataService from "../service/user.service";
import '../styles.css';
import { Button, Modal, Pagination } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

const cookies = new Cookies();

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchQuery = this.onChangeSearchQuery.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveUser = this.setActiveUser.bind(this);
    this.searchQuery = this.searchQuery.bind(this);
    this.closeDeletePrompt = this.closeDeletePrompt.bind(this);
    this.launchDeletePrompt = this.launchDeletePrompt.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.retrieveUsersPaged = this.retrieveUsersPaged.bind(this);
    this.setPage = this.setPage.bind(this);

    this.state = {
      users: [],
      currentUser: null,
      currentIndex: -1,
      searchQuery: "",
      prompt: false,
      enlarge: false,
      message: "",
      
      page: 1,
      pageSize: 5,
      fullCount: 0,
      pageCount: 1
    };

    this.pageSizes = [5, 10, 15];
  }

  componentDidMount() {
    this.retrieveUsersPaged();
  }

  // Retrieve users through a paging model
  retrieveUsersPaged() {
    const { searchQuery, page, pageSize } = this.state;

    UserDataService.getAllPaged(page, pageSize, searchQuery)
      .then((response) => {
        
        const users = response.data;

        this.setState({
          users: users,

        });

      })
      .catch((e) => {
        console.log(e);
      });

    UserDataService.getAllUnpaged(searchQuery)
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
        page: 1,
        currentUser: null,
        currentIndex: null
      },
      () => {
        this.retrieveUsersPaged();
      }
    );
  }

  // Handler for title change
  onChangeSearchQuery(e) {
    const searchQuery = e.target.value;

    this.setState({
      searchQuery: searchQuery
    });
  }

  // Refresh lsit
  refreshList() {
    this.retrieveUsersPaged();
    this.setState({
      currentUser: null,
      currentIndex: -1,
    });
  }

  // Set the user for display
  setActiveUser(user, index) {
    this.setState({
      currentUser: user,
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

  // Search for a user by username
  searchQuery() {
    // On an empty query, return to original results
    if(!this.state.searchQuery){
      this.retrieveUsersPaged();

      this.setState({
        inputSearch: "",
        currentIndex: -1,
        currentUser: null
      })
    }
    else{
      UserDataService.getAllPaged(this.state.page, this.state.pageSize, this.state.searchQuery)
      .then(response => {
        this.setState({
          users: response.data,
          inputSearch: this.state.searchQuery,
          currentIndex: -1,
          currentUser: null,
          page: 1,
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

      UserDataService.getAllUnpaged(this.state.searchQuery)
      .then((response) => {
  
        this.setState({
          fullCount: response.data.length,
          pageCount: Math.ceil(response.data.length/this.state.pageSize)
        })
      })
      .catch(e => {
        console.log(e);
      })
    }
  }

  // Paging
  setPage(newPage){
    if(newPage >= 1 && newPage <= this.state.pageCount){
      this.setState({
        page: newPage,
        currentIndex: -1,
        currentUser: null
      },
      () => {
        this.retrieveUsersPaged();
      }
      );
    }
  }

  render() {
    const { searchQuery, users, currentUser, currentIndex, pageSize, page } = this.state;
    const year = this.props.year;

    return (
    <>
      {cookies.get('role') === 'ADMIN' ?
      <div className="list row" style={{marginLeft:"100px"}}>
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchQuery}
              onChange={this.onChangeSearchQuery}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchQuery}
              >
                Search
              </button>
            </div>

          </div>
        </div>
        <div className="col-md-6">
          <h4>Users List</h4>

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

          {this.state.message ? <div style={{color:"green", outline: "1px green dashed"}}><p>User successfully deleted!</p></div>: <Fragment></Fragment>}
          <p>If you are unable to find a specific user, try searching for their username.</p>

          <ul className="list-group mt-3">
            {users.length !== 0 ? users &&
              users.map((user, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveUser(user, index)}
                  key={user.user_id}
                >
                  {user.username}
                </li>
              )) : <li style={{listStyleType: "none"}}>No users found. Try a different username.</li>
              }
          </ul>

          {this.state.inputSearch ? 
            <p>{this.state.fullCount} total results found for "{this.state.inputSearch}"</p>
            :
            <p>{this.state.fullCount} total results found</p>
          }

          <p>Page {page} of {this.state.pageCount === 0 ? 1 : this.state.pageCount}</p>
          
        </div>
        <div className="col-md-6">
          {currentUser ? (
            <Fragment>
                <Modal show={this.state.prompt} onHide={this.closeDeletePrompt}>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete {currentUser.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete all user from {year}?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDeletePrompt}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={this.deleteUser}>
                        Remove All
                    </Button>
                    </Modal.Footer>
                </Modal>

            <Fragment>
                <label>
                  <h3>ID:</h3><p>{currentUser.user_id}</p>
                </label>{" "}
              </Fragment><br/>

              <Fragment>
                <label>
                  <h3>Username:</h3><p>{currentUser.username}</p>
                </label>{" "}
              </Fragment><br/>

              <Fragment>
                <label>
                  <h4>Email:</h4><p>{currentUser.email}</p>
                </label>{" "}
              </Fragment><br/>

              <Fragment>
                <label>
                  <h4>Account Created:</h4><p>{new Date(Date.parse(currentUser.created_at)).toUTCString()}</p>
                </label>{" "}
              </Fragment><br/>

              <Fragment>
                <label>
                  <h4>Last Login:</h4><p>{new Date(Date.parse(currentUser.last_login)).toUTCString()}</p>
                </label>{" "}
              </Fragment><br/>

              <br/>

              {cookies.get('role') === 'ADMIN' && currentUser.username !== 'rootUser' ? 
                <Button
                  onClick={() => {console.log("placeholder")}}
                  variant="danger"
                >
                  Delete
                </Button>

              :
                ""
              }
            </Fragment>
          ) : (
            <Fragment>
              <br />
              <p>Please click on a User...</p>
            </Fragment>
          )}
        </div>
      </div>
      :
      <Navigate replace to="/notAuthenticated" />
    }
    </>
    );
  }
}