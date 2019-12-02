//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Redirect } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

//> Components
import { 
  Register,
  Login,
} from "../../organisms/sections";

import {
  TextTypist,
} from "../../molecules";

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

  // Log in with JWT token, received from engine.snek.at/api/graphiql
  logMeIn = (token) => {
    // JWT Token
    localStorage.setItem("jwt_snek", token);
    this.props.login(token);
  }

  render() {
    const { globalStore } = this.props;

    if(globalStore.data.logged) { return (<Redirect to="/me"/>); }

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
