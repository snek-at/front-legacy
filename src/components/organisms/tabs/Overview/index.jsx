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
// Molecules
import {
  Calendar2D,
  Calendar3D
} from "../../../molecules";

class Overview extends React.Component {
  render() {
    console.log(this.props.languages);
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        {this.props.languages &&
        <MDBRow className="text-center text-md-left mb-4">
        {Object.keys(this.props.languages).map((key, i) => {
          if(i < 6){
            return(
              <MDBCol md="4" key={i}>
                <span className="mb-2 text-muted">
                  <MDBIcon icon="square" className="pr-2" style={{color: this.props.languages[key].color}} />
                  {this.props.languages[key].name} <small>{this.props.languages[key].share}%</small>
                </span>
              </MDBCol>
            );
          }
        })}
        </MDBRow>
        }
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
