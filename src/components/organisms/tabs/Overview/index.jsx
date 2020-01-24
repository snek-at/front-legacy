//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
} from "mdbreact";

//> Components
import {
  Calendar3D,
  Calendar2D,
} from "../../../atoms"

//> CSS
import "./overview.scss";

class Overview extends React.Component {
  state = {};

  render() {
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        <Calendar3D
        platformData={this.props.platformData}
        />
        <Calendar2D
        platformData={this.props.platformData}
        />
      </MDBTabPane>
    );
  }
}

export default Overview;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
