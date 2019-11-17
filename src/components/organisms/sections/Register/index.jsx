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
    {
      id: Math.random() * "Aichnerccc".length + "gitlab".length,
      source: "gitlab",
      username: "Aichnerccc"
    },
    {
      id: Math.random() * "Kleberwald".length + "github".length,
      source: "github",
      username: "Kleberwald"
    },
    {
      id: Math.random() * "aichnerchristian".length + "bitbucket".length,
      source: "bitbucket",
      username: "aichnerchristian"
    }
  ]
};

class Register extends React.Component {
  state = {
    email: "",
    password: "",
    password1: "",
    username: null,
    oAuthGitHubButton: true,
    oAuthGitHubData: null,
    sourceList: [],
    customUsername: false
  };

  componentDidMount = () => {
    // Preset some connected accounts for testing purposes
    this.setState({
      sourceList: data.sources
    });
  };

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  connectGitHub = () => {
    // Debugging
    //console.log("GitHub oAuth function called.");

    // Disable button while oAuth in progress
    this.setState({
      oAuthGitHubButton: false
    });

    // Do oAuth magic, then enable GitHub button button again

    //> In the .then() function
    // Replace with the data you get from oAuth
    let data = {
      username: "Aichnerc"
    };
    // Set the data and after the state is set, push it to the list to display
    this.setState(
      {
        oAuthGitHubData: data
      },
      () => this.pushToSourceList("github", data.username)
    );
  };

  pushToSourceList = (source, username) => {
    //console.log(source,username);
    let sourceList = this.state.sourceList;

    sourceList.push({
      id: Math.random() * username.length + source.length,
      source,
      username
    });
    // Set the new list
    this.setState({
      sourceList,
      username: this.state.username
        ? this.state.username
        : sourceList[0].username
    });
  };

  removeSource = id => {
    let sourceList = this.state.sourceList.filter(function(obj) {
      return obj.id !== id;
    });
    this.setState({
      sourceList
    });
  };

  handleUserNamePick = source => {
    this.setState({
      username: source.username
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
                return (
                  <MDBListGroupItem
                    className={"list-item-" + source.source}
                    key={i}
                  >
                    <div>
                      <MDBIcon
                        fab
                        icon={source.source}
                        className="company-icon"
                      />
                      {source.username}
                      <MDBIcon icon="check" className="text-success ml-2" />
                    </div>
                    <MDBIcon
                      icon="times"
                      className="close-icon"
                      onClick={() => this.removeSource(source.id)}
                    />
                  </MDBListGroupItem>
                );
              })}
            </MDBListGroup>
          </div>
          {this.state.sourceList.length > 0 && (
            <div className="pt-4">
              <p className="lead">Choose your username</p>
              {this.state.sourceList.map((source, i) => {
                return (
                  <MDBInput
                    key={i}
                    onClick={e => this.handleUserNamePick(source)}
                    checked={
                      this.state.username === source.username ? true : false
                    }
                    label={source.username}
                    type="radio"
                    id={"radio" + i}
                  />
                );
              })}
            </div>
          )}
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
