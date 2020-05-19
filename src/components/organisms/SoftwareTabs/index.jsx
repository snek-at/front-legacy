//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer } from "mdbreact";
//#endregion

//#region > Components
class SoftwareEngineer extends React.Component {
  state = {};

  render() {
    return (
      <MDBContainer>
        <p>Software Tabs</p>
      </MDBContainer>
    );
  }
}
//#endregion

//#region > Exports
export default SoftwareEngineer;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
