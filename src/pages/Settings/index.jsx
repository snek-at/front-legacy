//> React
// Contains all the functionality necessary to define React components
import React from "react";

import {
  MDBContainer,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon
} from "mdbreact";

class Settings extends React.Component {
  state = {
    activeItemOuterTabs: "1",
    activeItemInnerPills: "1"
  };

  toggleOuterTabs = tab => e => {
    if (this.state.activeItemOuterTabs2 !== tab) {
      this.setState({
        activeItemOuterTabs: tab
      });
    }
  };

  toggleInnerPills = tab => e => {
    if (this.state.activeItemInnerPills !== tab) {
      this.setState({
        activeItemInnerPills: tab
      });
    }
  };
  render() {
    return (
      <MDBContainer>
        <h2 className="mt-5">Pills within the tabs</h2>
        <MDBNav tabs className="nav-justified" color="primary">
          <MDBNavItem>
            <MDBNavLink
              to="#"
              active={this.state.activeItemOuterTabs === "1"}
              onClick={this.toggleOuterTabs("1")}
              role="tab"
            >
              <MDBIcon icon="user" /> Profile
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink
              to="#"
              active={this.state.activeItemOuterTabs === "2"}
              onClick={this.toggleOuterTabs("2")}
              role="tab"
            >
              <MDBIcon icon="heart" /> Follow
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent
          className="card mb-5"
          activeItem={this.state.activeItemOuterTabs}
        >
          <MDBTabPane tabId="1" role="tabpanel">
            <MDBRow>
              <MDBCol md="3">
                <MDBNav pills color="primary" className="flex-column">
                  <MDBNavItem>
                    <MDBNavLink
                      to="#"
                      active={this.state.activeItemInnerPills === "1"}
                      onClick={this.toggleInnerPills("1")}
                    >
                      Downloads <MDBIcon icon="download" className="ml-2" />
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      to="#"
                      active={this.state.activeItemInnerPills === "2"}
                      onClick={this.toggleInnerPills("2")}
                    >
                      Orders & invoices
                      <MDBIcon icon="file-alt" className="ml-2" />
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      to="#"
                      active={this.state.activeItemInnerPills === "3"}
                      onClick={this.toggleInnerPills("3")}
                    >
                      Billing Details
                      <MDBIcon icon="address-card" className="ml-2" />
                    </MDBNavLink>
                  </MDBNavItem>
                </MDBNav>
              </MDBCol>
              <MDBCol md="9">
                <MDBTabContent activeItem={this.state.activeItemInnerPills}>
                  <MDBTabPane tabId="1">
                    <h5>Panel 1</h5>
                  </MDBTabPane>
                  <MDBTabPane tabId="2">
                    <h5>Panel 2</h5>
                  </MDBTabPane>
                  <MDBTabPane tabId="3">
                    <h5>Panel 3</h5>
                  </MDBTabPane>
                </MDBTabContent>
              </MDBCol>
            </MDBRow>
          </MDBTabPane>
          <MDBTabPane tabId="2" role="tabpanel">
            <MDBRow>
              <MDBCol md="6">
                <MDBCardBody>
                  <MDBCardTitle>Special Title Treatment</MDBCardTitle>
                  <MDBCardText>
                    With supporting text below as a natural lead-in to
                    additional content.
                  </MDBCardText>
                  <MDBBtn>Go somewhere</MDBBtn>
                </MDBCardBody>
              </MDBCol>
              <MDBCol md="6">
                <MDBCardBody>
                  <MDBCardTitle>Special Title Treatment</MDBCardTitle>
                  <MDBCardText>
                    With supporting text below as a natural lead-in to
                    additional content.
                  </MDBCardText>
                  <MDBBtn>Go somewhere</MDBBtn>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBTabPane>
        </MDBTabContent>
      </MDBContainer>
    );
  }
}

export default Settings;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
