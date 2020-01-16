//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
} from "mdbreact";

//> Components
import {
  Register,
} from "../../organisms";

//> CSS
import "./homepage.scss";

class HomePage extends React.Component {
  state = {};

  render() {
    return (
      <div id="home" className="pt-5">
        <MDBContainer className="mb-5 pb-5">
          <MDBRow className="flex-center">
            <MDBCol md="6">
              <h1>We are sneks.<br/>Hisssss.</h1>
            </MDBCol>
            <MDBCol md="6">
              <MDBCard className="px-3 py-4">
                <Register />
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="position-relative">
          <div className="banner-wrapper">
            <div className="banner"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
