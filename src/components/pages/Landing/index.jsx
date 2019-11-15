//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdbreact";

//> Components
import {
  Register,
  Login,
} from "../../organisms/sections";

//> CSS
import "./landing.scss";

class Landing extends React.Component {

  state = {
    login: false,
  }

  logMeIn = (token) => {
    localStorage.setItem('fprint', token);
  }

  render() {
    
    const { globalStore } = this.props;

    if(globalStore.data.loaded){
      return (
        <div id="landing" className="py-5">
          <MDBContainer>
            <MDBRow className="flex-center">
              <MDBCol md="6">
                <h1>Built for engineers</h1>
                <MDBBtn
                color="white"
                onClick={() => this.setState({login: !this.state.login})}
                >
                {this.state.login ? "Join us now" : "Sign in"}
                </MDBBtn>
              </MDBCol>
              <MDBCol md="6">
              {this.state.login ? (
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
