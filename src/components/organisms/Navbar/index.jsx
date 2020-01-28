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
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBSmoothScroll,
  MDBIcon,
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

  render() {
    const { globalState } = this.props;

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
              {(!globalState.loading && globalState.logged && globalState.user) ? (
                <a href={"/u/"+this.props.username}>
                  <MDBNavbarBrand className="flex-center">
                    <img src={SNEKLogo} alt="SNEK Logo" className="img-fluid mr-2" />
                    <span className="font-weight-bold">SNEK</span>
                  </MDBNavbarBrand>
                </a>
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
              {(globalState.logged && !globalState.loading && globalState.fetchedUser) &&
              <>
              <div className="spacer" />
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <img
                    src={globalState.fetchedUser.platformData.user.avatarUrl}
                    className="z-depth-0"
                    alt={globalState.fetchedUser.platformData.user.name} 
                    />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu className="dropdown-default">
                    <MDBDropdownItem href="#!">My profile</MDBDropdownItem>
                    <Link to="/" onClick={this.props.logmeout} className="dropdown-item">
                    Sign Out
                    </Link>
                  </MDBDropdownMenu>
                </MDBDropdown>
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
