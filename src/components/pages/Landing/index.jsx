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
  Register,
  Login,
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
  constructor(props) {
    super(props);
  }

  logMeIn = (token) => {
    localStorage.setItem("fprint", token);
  }

  render() {
    const { globalStore } = this.props;

    if(globalStore.data.loaded){
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
                {globalStore.data.pageLogin ? (
                  <Login 
                  token={globalStore.data.token}
                  loginHandler={this.logMeIn}
                  />
                ) : (
                  <Register 
                  token={globalStore.data.token}
                  />
                )}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default Landing;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
