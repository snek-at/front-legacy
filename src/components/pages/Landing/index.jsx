//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

//> Components
import {
  TextTypist,
} from "../../molecules";

//> Components
import { 
  Register
} from "../../organisms/sections";

//> CSS
import "./landing.scss";

//> Typist Data
const scope = [
  "engineers",
  "programmers",
  "developers",
  "entrepreneurs",
  "students",
  "teachers",
  "sneks"
];

class Landing extends React.Component {
  render() {
    return (
      <div id="landing" className="py-5">
        <MDBContainer>
          <MDBRow className="">
            <MDBCol md="6" className="pt-5">
              <h1 className="mt-5">
              Built for <TextTypist scope={scope} />
              </h1>
            </MDBCol>
            <MDBCol md="6">
              <Register />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Landing;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
