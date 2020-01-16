//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBAlert,
  MDBBtn,
} from "mdbreact";

//> Images
import { ReactComponent as SvgSoftware } from '../../../assets/header/dev.svg';
import { ReactComponent as SvgMedia } from '../../../assets/header/media.svg';

class Register extends React.Component {
  state = {
    step: 0
  };

  render() {
    return (
      <div className="text-center">
        {this.state.step === 0 &&
          <>
            <h2 className="mb-3">Choose your snek</h2>
            <MDBRow>
              <MDBCol md="6">
                <div className="selectType">
                  <p className="lead">Software Engineer</p>
                  <SvgSoftware />
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div className="selectType">
                <p className="lead">Media Engineer</p>
                  <SvgMedia />
                </div>
              </MDBCol>
            </MDBRow>
          </>
        }
      </div>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
