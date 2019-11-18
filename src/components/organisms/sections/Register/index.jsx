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
  MDBTooltip,
  MDBPopover,
  MDBPopoverHeader,
  MDBPopoverBody,
  MDBIcon
} from "mdbreact";

//> CSS
import "./register.scss";

//> Dummy data
const data = {
  sources: [
    {
      id: Math.random() * "Aichnerc".length + "gitlab".length,
      source: "gitlab",
      username: "Aichnerc"
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
    username: "",
    oAuthGitHubButton: true,
    oAuthGitHubData: null,
    sourceList: [],
    customUsername: false,
    usernames: []
  };

  componentDidMount = () => {
    // Preset some connected accounts for testing purposes
    let usernames = this.state.usernames;
    let sourceList = this.state.sourceList;

    data.sources.map((source, i) => {
      sourceList.push(source);

      this.setState(
        {
          sourceList
        },
        () => this.addToUsernames(source.username)
      );
    });
  };

  addToUsernames = (username) => {
    let usernames = this.state.usernames;
    if (!usernames.includes(username)) {
      usernames.push(username);
      this.setState({
        usernames
      });
    }
  };

  changeHandler = (e) => {
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

    this.addToUsernames(username);

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

  removeSource = (id) => {
    let sourceList = this.state.sourceList.filter(function(obj) {
      return obj.id !== id;
    });
    this.setState({
      sourceList
    });
  };

  handleUserNamePick = (username) => {
    this.setState({
      username
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
            value={this.state.email}
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
            <MDBTooltip placement="bottom">
              <MDBBtn floating color="orange" className="mx-1" disabled>
                <MDBIcon fab icon="gitlab" />
              </MDBBtn>
              <div>Link GitLab account</div>
            </MDBTooltip>
            <MDBTooltip placement="bottom">
              <MDBBtn
                floating
                social="git"
                className="mx-1"
                onClick={this.connectGitHub}
                disabled={!this.state.oAuthGitHubButton}
              >
                <MDBIcon fab icon="github" />
              </MDBBtn>
              <div>Link GitHub account</div>
            </MDBTooltip>
            <MDBTooltip placement="bottom">
              <MDBBtn floating social="blue" className="mx-1" disabled>
                <MDBIcon fab icon="bitbucket" />
              </MDBBtn>
              <div>Link Bitbucket account</div>
            </MDBTooltip>
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
                      <MDBPopover
                        placement="right"
                        domElement
                        clickable
                        popover
                        tag="span"
                        id="popper1"
                      >
                        <span>
                          <MDBIcon
                            icon="check"
                            className="text-success ml-2 cursor-pointer"
                          />
                        </span>
                        <div>
                          <MDBPopoverHeader>Verified</MDBPopoverHeader>
                          <MDBPopoverBody>
                            <MDBRow className="justify-content-center align-items-center m-0">
                              <MDBCol size="auto" className="p-0 text-success">
                                <MDBIcon icon="award" size="3x" />
                              </MDBCol>
                              <MDBCol className="p-0 pl-3">
                                This source has been{" "}
                                <strong className="text-success">
                                  verified
                                </strong>{" "}
                                by logging into it.
                              </MDBCol>
                            </MDBRow>
                          </MDBPopoverBody>
                        </div>
                      </MDBPopover>
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
              {this.state.usernames.map((username, i) => {
                return (
                  <MDBInput
                    key={i}
                    onClick={(e) => this.handleUserNamePick(username)}
                    checked={this.state.username === username ? true : false}
                    label={username}
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
