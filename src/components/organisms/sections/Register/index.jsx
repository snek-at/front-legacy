//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardText,
  MDBInput,
  MDBBtn,
  MDBBadge,
  MDBIcon
} from "mdbreact";

//> CSS
import "./register.scss";

//> Dummy data
const data = {
  sources: [
    { name: "github", user: "Aichnerc" },
    { name: "gitlab", user: "Aichnerc" },
    { name: "github", user: "Kleberwald" },
    { name: "bitbucket", user: "aichnerchristian" }
  ]
};

class Register extends React.Component {
  state = {
    email: "",
    password: ""
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <MDBCard id="register" className="text-dark">
        <MDBCardBody>
          <h2>Join us</h2>
          <MDBInput
            label="Email"
            type="email"
            name="email"
            outline
            value={this.state.username}
            onChange={this.changeHandler}
            size="lg"
          />
          <div>
            <p className="lead">Connect your work</p>
            <MDBBtn floating color="black" className="mr-3">
              <MDBIcon icon="plus" />
            </MDBBtn>
            <MDBBtn floating color="orange" className="mx-1">
              <MDBIcon fab icon="gitlab" />
            </MDBBtn>
            <MDBBtn floating social="git" className="mx-1">
              <MDBIcon fab icon="github" />
            </MDBBtn>
            <MDBBtn floating social="blue" className="mx-1">
              <MDBIcon fab icon="bitbucket" />
            </MDBBtn>
          </div>
          <div>
            <MDBListGroup>
              {data.sources.map((source, i) => {
                return (
                  <MDBListGroupItem className={"list-item-" + source.name}>
                    <div>
                      <MDBIcon
                        fab
                        icon={source.name}
                        className="company-icon"
                      />
                      {source.user}
                    </div>
                    <MDBIcon icon="times" className="close-icon" />
                  </MDBListGroupItem>
                );
              })}
            </MDBListGroup>
          </div>
          <MDBInput
            label="Password"
            type="password"
            name="password"
            outline
            value={this.state.password}
            onChange={this.changeHandler}
            size="lg"
          />
          <MDBInput
            label="Repeat password"
            type="password"
            name="username2"
            outline
            value={this.state.password2}
            onChange={this.changeHandler}
            size="lg"
          />
          <MDBBtn color="success" className="w-100 py-3 font-weight-bold">
            Sign up for SNEK
          </MDBBtn>
        </MDBCardBody>
        <MDBCardFooter></MDBCardFooter>
      </MDBCard>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
