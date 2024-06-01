import Nav  from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

function MainNavbar({selected}) {
    if(selected.id === 1){
        return (
            <header>
              <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
                <Container>
                  <Navbar.Brand href="/index" >            
                    <img
                      src="./img/logo.png"
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
                      <Nav.Link href="/index" style={{backgroundColor:"#000000", borderRadius: "10px"}}>Home</Nav.Link>
                      <Nav.Link href="/about">About</Nav.Link>
                      <NavDropdown title="Archive" id="basic-nav-dropdown" data-bs-theme="dark">
                        <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                        <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                        <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                        <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                        <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                        <NavDropdown.Item href="/artwork">Current (2024)</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                  {/* <form className="form-inline my-2 my-lg-0" method='get' action="" style={{display:'flex'}}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </form> */}
                </Container>
              </Navbar>
            </header>
        )
    }

    else if(selected.id === 2){
        return (
            <header>
              <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
                <Container>
                  <Navbar.Brand href="/index" >            
                    <img
                      src="./img/logo.png"
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
                      <Nav.Link href="/index">Home</Nav.Link>
                      <Nav.Link href="/about" style={{backgroundColor:"#000000", borderRadius: "10px"}}>About</Nav.Link>
                      <NavDropdown title="Archive" id="basic-nav-dropdown" data-bs-theme="dark">
                        <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                        <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                        <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                        <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                        <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                        <NavDropdown.Item href="/artwork">Current (2024)</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                  {/* <form className="form-inline my-2 my-lg-0" method='get' action="" style={{display:'flex'}}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                  </form> */}
                </Container>
              </Navbar>
            </header>
        )
    }
    
    else if(selected.id === 4){
      return (
        <header>
          <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
            <Container>
              <Navbar.Brand href="/index" >            
                <img
                  src="./img/logo.png"
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
                  <Nav.Link href="/index">Home</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  <NavDropdown title="Archive" style={{backgroundColor:"#000000", borderRadius: "10px"}} id="basic-nav-dropdown" data-bs-theme="dark">
                    <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                    <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                    <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                    <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                    <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                    <NavDropdown.Item href="/artwork">Current (2024)</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
              {/* <form className="form-inline my-2 my-lg-0" method='get' action="" style={{display:'flex'}}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form> */}
            </Container>
          </Navbar>
        </header>
      )
    }
    else {
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
                  <Nav.Link href="/index">Home</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  <NavDropdown title="Archive" id="basic-nav-dropdown" data-bs-theme="dark">
                    <NavDropdown.Item href="/y1">Year 1 (2019)</NavDropdown.Item>
                    <NavDropdown.Item href="/y2">Year 2 (2020)</NavDropdown.Item>
                    <NavDropdown.Item href="/y3">Year 3 (2021)</NavDropdown.Item>
                    <NavDropdown.Item href="/y4">Year 4 (2022)</NavDropdown.Item>
                    <NavDropdown.Item href="/y5">Year 5 (2023)</NavDropdown.Item>
                    <NavDropdown.Item href="/artwork">Current (2024)</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
              {/* <form className="form-inline my-2 my-lg-0" method='get' action="" style={{display:'flex'}}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form> */}
            </Container>
          </Navbar>
        </header>
      )
    }
  }

  export default MainNavbar;