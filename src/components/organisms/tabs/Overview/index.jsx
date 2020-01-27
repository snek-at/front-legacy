//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBIcon,
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
    const { platformData } = this.props;
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        {platformData &&
        <MDBRow className="text-center text-md-left mb-4">
        {Object.keys(platformData.languages.slices).map((key, i) => {
          if(i < 6){
            return(
              <MDBCol md="4" key={i}>
                <span className="mb-2 text-muted">
                  <MDBIcon icon="square" className="pr-2" style={{color: platformData.languages.slices[key].color}} />
                  {platformData.languages.slices[key].name} <small>{platformData.languages.slices[key].share}%</small>
                </span>
              </MDBCol>
            );
          }
        })}
        </MDBRow>
        }
        <Calendar3D
        platformData={platformData}
        />
        <Calendar2D
        platformData={platformData}
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
