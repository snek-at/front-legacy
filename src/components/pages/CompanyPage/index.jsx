//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Redirect, Link } from "react-router-dom";

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
  MDBBadge,
  MDBView,
  MDBMask,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBProgress,
  MDBIcon,
} from "mdbreact";
// Chart.js
import { Doughnut } from "react-chartjs-2";

//> CSS
import "./company.scss";

class CompanyPage extends React.Component {
  state = {};

  render() {
    const { globalState } = this.props;

    return (
      <MDBContainer id="company">
        <p>Company</p>
      </MDBContainer>
    );
  }
}

export default CompanyPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
