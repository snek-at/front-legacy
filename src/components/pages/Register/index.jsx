//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
} from "mdbreact";

//> CSS
import "./register.scss";

class Register extends React.Component {

  state = {
    username: "",
    email: "",
    password: "",
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div id="register">
        <MDBContainer className="pt-5">
          <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.changeHandler}
          />
          <input
          type="email"
          name="email"
          value={this.state.email}
          onChange={this.changeHandler}
          />
          <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.changeHandler}
          />
        </MDBContainer>
      </div>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
