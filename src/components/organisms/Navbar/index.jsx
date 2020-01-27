//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { withRouter } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
  MDBSmoothScroll,
} from "mdbreact";

//> Additional
// Link
import { Link } from "react-router-dom";

//> Images
import SNEKLogo from "../../../assets/navigation/logo.png";

//> CSS
import "./navbar.scss";

class NavbarPage extends React.Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  logout = () => {
    if(localStorage.getItem("is_logged") && localStorage.getItem("jwt_snek")){
      localStorage.removeItem("is_logged");
      localStorage.removeItem("jwt_snek");
    }
  }

  render() {
    return (
      <MDBNavbar color="light" light expand="md">
        <MDBContainer>
            {this.props.location.pathname === "/" ? (
              <MDBSmoothScroll 
              to="home"
              className="d-inline"
              >
                <MDBNavbarBrand className="flex-center">
                  <img src={SNEKLogo} alt="SNEK Logo" className="img-fluid mr-2" />
                  <span className="font-weight-bold">SNEK</span>
                </MDBNavbarBrand>
              </MDBSmoothScroll>
            ) : (
              <>
              {localStorage.getItem("is_logged") ? (
                <Link to={"/u/"+this.props.username}>
                  <MDBNavbarBrand className="flex-center">
                    <img src={SNEKLogo} alt="SNEK Logo" className="img-fluid mr-2" />
                    <span className="font-weight-bold">SNEK</span>
                  </MDBNavbarBrand>
                </Link>
              ) : (
                <Link to="/">
                  <MDBNavbarBrand className="flex-center">
                    <img src={SNEKLogo} alt="SNEK Logo" className="img-fluid mr-2" />
                    <span className="font-weight-bold">SNEK</span>
                  </MDBNavbarBrand>
                </Link>
              )}
              </>
            )}          
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav left>
              <MDBNavItem>
                <input type="search" className="form-control" placeholder="Search..."/>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem active>
                <MDBNavLink to="#!">Home</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Ranking</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Developer</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Jobs</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to="#!">Trends</MDBNavLink>
              </MDBNavItem>
              {localStorage.getItem("is_logged") && localStorage.getItem("jwt_snek") &&
              <>
              <div className="spacer" />
              <MDBNavItem>
                <MDBNavLink to="/" onClick={this.logout}>Logout</MDBNavLink>
              </MDBNavItem>
              </>
              }
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    );
  }
}

export default withRouter(NavbarPage);

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
