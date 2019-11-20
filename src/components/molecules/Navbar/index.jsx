//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { withRouter } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBFormInline,
  MDBInput,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdbreact";

//> Components
import { 
  SearchBar
} from "../../molecules";

//> CSS
import "./navbar.scss";

class Navbar extends React.Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { location } = this.props;
    const { data } = this.props;
    return (
      <MDBNavbar color="elegant-color" dark expand="md">
        <MDBContainer>
          <MDBNavbarBrand>
            <strong className="white-text">SNEK</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <SearchBar />
            <MDBNavbarNav left>
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
            </MDBNavbarNav>
            <MDBNavbarNav right>
              <MDBNavItem active={data.pageLogin}>
              {location.pathname === "/" ? (
                <span 
                className="nav-link cursor-pointer"
                onClick={() => this.props.changeState("pageLogin", true)}
                >
                Sign in
                </span>
              ) : (
                <MDBNavLink to="/">Sign in</MDBNavLink>
              )}
              </MDBNavItem>
              <MDBNavItem active={!data.pageLogin}>
                {location.pathname === "/" ? (
                <span 
                className="nav-link cursor-pointer"
                onClick={() => this.props.changeState("pageLogin", false)}
                >
                Sign up
                </span>
              ) : (
                <MDBNavLink to="/">Sign up</MDBNavLink>
              )}
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    );
  }
}

export default withRouter(Navbar);

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
