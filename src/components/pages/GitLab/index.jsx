//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardText,
  MDBInput,
  MDBBtn,
  MDBBadge,
  MDBTooltip,
  MDBPopover,
  MDBPopoverHeader,
  MDBPopoverBody,
  MDBIcon,
} from "mdbreact";

class GitLab extends React.Component {
  render() {
    return(
      <MDBCard id="gitlab" className="text-dark">
      <MDBCardBody>
        <h2>GitLab</h2>
        <MDBInput
        label="Username"
        type="text"
        name="username"
        outline
        size="lg"
        />
        <MDBInput 
        label="Server"
        type="text"
        name="server"
        outline
        size="lg"
        />
        <MDBBtn
        color="success"
        className="w-100 py-3 font-weight-bold mx-0"
        >
        Sign in
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
    )
  }
}
export default GitLab;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
