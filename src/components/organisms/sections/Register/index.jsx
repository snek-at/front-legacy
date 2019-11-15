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
  MDBIcon,
} from "mdbreact";

//> CSS
import "./register.scss";

//> Dummy data
const data = {
  sources: [
    {source: "gitlab", username: "Aichnerc"},
    {source: "github", username: "Kleberwald"},
    {source: "bitbucket", username: "aichnerchristian"}
  ]
}

class Register extends React.Component{
  state = {
    email: "",
    password: "",
    password1: "",
    oAuthGitHubButton: true,
    sourceList: [],
  }

  componentDidMount = () => {
    // Preset some connected accounts for testing purposes
    this.setState({
      sourceList: data.sources
    });
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  connectGitHub = () => {
    // Debugging
    console.log("GitHub oAuth function called.");

    // Disable button while oAuth in progress
    this.setState({
      oAuthGitHubButton: false
    });

    // Do oAuth magic, then enable GitHub button button again

    // Example on how to push an item to the sources list
    this.pushToSourceList("github","Aichnerc");
  }

  pushToSourceList = (source, username) => {
    let sourceList = this.state.sourceList; 

    sourceList.push({
      id: source.charAt(Math.floor(Math.random() * source.length)),
      source: source,
      username: username,
    });

    console.log(sourceList);
  }

  render(){
    return(
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
            <div>
            <p className="lead">Connect your work</p>
              <small>
              You can connect multiple accounts - even from the same platform.
              </small>
            </div>
            <MDBBtn floating color="orange" className="mx-1" disabled>
              <MDBIcon fab icon="gitlab" />
            </MDBBtn>
            <MDBBtn 
            floating
            social="git"
            className="mx-1"
            onClick={this.connectGitHub}
            disabled={!this.state.oAuthGitHubButton}
            >
              <MDBIcon fab icon="github" />
            </MDBBtn>
            <MDBBtn floating social="blue" className="mx-1" disabled>
              <MDBIcon fab icon="bitbucket" />
            </MDBBtn>
          </div>
          <div>
            <MDBListGroup>
            {this.state.sourceList.map((source, i) => {
              return(
                <MDBListGroupItem 
                className={"list-item-"+source.source}
                key={i}
                >
                  <div>
                  <MDBIcon 
                  fab
                  icon={source.source}
                  className="company-icon"
                  />
                  {source.username}
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
          <MDBBtn
          color="success"
          className="w-100 py-3 font-weight-bold"
          >
          Sign up for SNEK
          </MDBBtn>
        </MDBCardBody>
        <MDBCardFooter>

        </MDBCardFooter>
      </MDBCard>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
