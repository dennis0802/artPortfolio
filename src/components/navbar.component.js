import Nav  from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Cookies from "universal-cookie"
import TokenDataService from "../service/token.service"
import { useEffect, useState } from 'react';

const cookies = new Cookies();

function MainNavbar({selected}) {
      const [loggedInUser, setLoggedInUser] = useState(false);
      const [loggedInAdmin, setLoggedInAdmin] = useState(false);
      const [user, setUser] = useState("")

      const isVerified = function(){
        TokenDataService.decodeJWT(cookies.get('session'))
        .then(response =>{
          setLoggedInAdmin(response.data.role === 'ADMIN');
          setLoggedInUser(response.data.role === 'USER');
          setUser(response.data.username);
        })
        .catch(e => {
          
        })
      }

      useEffect(() => {
        isVerified();
      });

      return (
          <header>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
              <Container>
                <Navbar.Brand href="/index" >            
                  <img
                    src="../img/logo.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="Logo"
                  />{' '}
                  Digital Art Portfolio
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    {selected.id === 1 ? 
                      <Nav.Link href="/index" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Home</Nav.Link> 
                      : 
                      <Nav.Link href="/index">Home</Nav.Link>
                    }

                    {selected.id === 2 ? 
                      <Nav.Link href="/about" style={{backgroundColor:"#101720", borderRadius: "10px"}}>About</Nav.Link> 
                      : 
                      <Nav.Link href="/about">About</Nav.Link>
                    }

                    {selected.id === 3 ?
                      <NavDropdown title="Artwork" id="basic-nav-dropdown" data-bs-theme="dark" style={{backgroundColor:"#101720", borderRadius: "10px"}}>
                        {selected.subId === 1 ?
                          <NavDropdown.Item href="/y1" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Year 1 (2019)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                        }
                        {selected.subId === 2 ?
                          <NavDropdown.Item href="/y1" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Year 2 (2020)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                        }
                        {selected.subId === 3 ?
                          <NavDropdown.Item href="/y1" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Year 3 (2021)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                        }
                        {selected.subId === 4 ?
                          <NavDropdown.Item href="/y4" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Year 4 (2022)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                        }
                        {selected.subId === 5 ?
                          <NavDropdown.Item href="/y5" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Year 5 (2023)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                        }
                        {selected.subId === 6 ?
                          <NavDropdown.Item href="/y6" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Current (2024)</NavDropdown.Item>
                          :
                          <NavDropdown.Item href="/y6">Current (2024)</NavDropdown.Item>
                        }
                      </NavDropdown>
                      :
                      <NavDropdown title="Artwork" id="basic-nav-dropdown" data-bs-theme="dark">
                        <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                        <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                        <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                        <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                        <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                        <NavDropdown.Item href="/y6">Current (2024)</NavDropdown.Item>
                      </NavDropdown>
                    }

                    {loggedInAdmin ? 
                      selected.id === 5 ?
                      <Nav.Link href="/users" style={{backgroundColor:"#101720", borderRadius: "10px"}}>View Users</Nav.Link>
                      :
                      <Nav.Link href="/users" >View Users</Nav.Link> 
                    :
                    ""
                    }

                    {loggedInAdmin || loggedInUser ? 
                      selected.id === 4 ?
                      <NavDropdown title={user} id="basic-nav-dropdown" data-bs-theme="dark" style={{backgroundColor:"#101720", borderRadius: "10px"}}>
                      {selected.subId === 1 ?
                        <NavDropdown.Item href="/account" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Manage Your Info</NavDropdown.Item>
                      :
                        <NavDropdown.Item href="/account">Manage Your Info</NavDropdown.Item>
                      }
                      {selected.subId === 2 ?
                        <NavDropdown.Item href="/logout" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Logout</NavDropdown.Item> 
                      :
                        <NavDropdown.Item href="/logout" >Logout</NavDropdown.Item> 
                      }
                      </NavDropdown>
                      :
                      <NavDropdown title={user} id="basic-nav-dropdown">
                        <NavDropdown.Item href="/account">Manage Your Info</NavDropdown.Item>
                        <NavDropdown.Item href="/logout" >Logout</NavDropdown.Item> 
                      </NavDropdown>
                    :
                      selected.id === 4 ?
                      <Nav.Link href="/login" style={{backgroundColor:"#101720", borderRadius: "10px"}}>Login</Nav.Link>
                      :
                      <Nav.Link href="/login">Login</Nav.Link>
                    }

                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>
      )
    }

  export default MainNavbar;