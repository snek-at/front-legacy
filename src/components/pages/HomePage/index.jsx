//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBIcon } from "mdbreact";

//> Components
// To be added

//> CSS
// To be added
//#endregion

//#region > Components
class HomePage extends React.Component {
  state = {};

  saveSettings = (state) => {
    this.props.saveSettings(state);
  };

  render() {
    return <h2>Home</h2>;
  }
}
//#endregion

//#region > Exports
export default HomePage;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
