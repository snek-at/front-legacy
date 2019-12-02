//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { 
  MDBTabPane
} from "mdbreact";

//> Components
// Molecules
import {
  Calendar2D,
  Calendar3D
} from "../../../molecules";

class Overview extends React.Component {
  render() {
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        {(this.props.contrib && this.props.calendar) && (
          <>
            <Calendar3D contrib={this.props.contrib} calendar={this.props.calendar} />
            {this.props.contrib && (
              <Calendar2D calendar={this.props.calendar} />
            )}
          </>
        )}
      </MDBTabPane>
    );
  }
}

export default Overview;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
