//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional modules
// Password hashing
import { sha256 } from "js-sha256";

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
  MDBIcon,
} from "mdbreact";

//> CSS
import "./register.scss";

// OAuth
import { githubProvider } from "../../../../intel/OAuthGithub/providers/github";
import RSA from "react-very-simple-oauth";

// Apollo
import { graphql } from "react-apollo";
import * as compose from "lodash.flowright";
import { gql } from "apollo-boost";

// Register mutation
const CREATE_USER_MUTATION = gql`
    mutation register($token: String!, $values: GenericScalar!) {
        registrationFormPage(token: $token, url: "/registration", values: $values) {
            result
            errors {
            name
            errors
            }
        }
    }
`;

class Register extends React.Component{
  state = {
    email: "",
    password: "",
    password1: "",
    username: "",
    oAuthGitHubButton: true,
    oAuthGitHubData: null,
    sourceList: [],
    customUsername: false,
    usernames: [],
  }

  addToUsernames = (username) => {
    let usernames = this.state.usernames;
    if(!usernames.includes(username)){
      usernames.push(username);
      this.setState({
        usernames
      });
    }
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  connectGitHub = async () => {
    // Debugging
    //console.log("GitHub oAuth function called.");
    
    // Disable button while oAuth in progress
    this.setState({
      oAuthGitHubButton: false
    });

    const data = await RSA.acquireTokenAsync(githubProvider);
    this.setState({
      oAuthGitHubData: data,
      oAuthGitHubButton: true
    }, () => this.pushToSourceList("github", data.username));
  }

  pushToSourceList = (source, username) => {
    //console.log(source,username);
    let sourceList = this.state.sourceList;

    this.addToUsernames(username);

    sourceList.push({
      id: Math.random() * username.length + source.length,
      source,
      username,
    });
    // Set the new list
    this.setState({
      sourceList,
      username: this.state.username ? this.state.username : sourceList[0].username
    });
  }

  removeSource = (id) => {
    let sourceList = this.state.sourceList.filter(function( obj ) {
        return obj.id !== id;
    });
    this.setState({
      sourceList
    });
  }

  handleUserNamePick = (username) => {
    this.setState({
      username
    });
  }

  handleSubmit = () => {
    let token = this.props.token;
    
    let values = {
      sources: JSON.stringify(this.state.sourceList),
      username: "Aichnerc",
      email: this.state.email,
      password: sha256(this.state.password),
      "platform_data": {
        server: "",
        platformName: "github",
        token: "32802d68bf4f97ca1826fc17da8dd3326c82ed0b"
      }
    };
    //> Debugging entry point
    //console.log(values);
    this.props.register({
      variables: { 
        token,
        values
      }
    })
    .then(({data}) => {
      //console.log(data);
    })
    .catch((error) => {
      //console.warn("Mutation error:",error.message);
    });
  }

  render(){
    //> Debugging entry point
    //console.log(this.state);
    //console.log(this.props);
    return(
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
            <MDBTooltip
              placement="bottom"
            >
              <MDBBtn floating color="orange" className="mx-1" disabled>
                <MDBIcon fab icon="gitlab" />
              </MDBBtn>
              <div>
                  Link GitLab account
              </div>
            </MDBTooltip>
            <MDBTooltip
              placement="bottom"
            >
              <MDBBtn 
              floating
              social="git"
              className="mx-1"
              onClick={this.connectGitHub}
              disabled={!this.state.oAuthGitHubButton}
              >
                <MDBIcon fab icon="github" />
              </MDBBtn>
                <div>
                  Link GitHub account
              </div>
            </MDBTooltip>
            <MDBTooltip
              placement="bottom"
            >
              <MDBBtn floating social="blue" className="mx-1" disabled>
                <MDBIcon fab icon="bitbucket" />
              </MDBBtn>
              <div>
                Link Bitbucket account
              </div>
            </MDBTooltip>
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
                            This source has been <strong className="text-success">verified</strong> by logging into it.
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
          {this.state.sourceList.length > 0 &&
          <div className="pt-4">
            <p className="lead">Choose your username</p>
            {this.state.usernames.map((username, i) => {
              return(
                <MDBInput 
                key={i}
                onClick={(e) => this.handleUserNamePick(username)}
                checked={this.state.username === username ? true : false}
                label={username}
                type="radio"
                id={"radio"+i}
                />
              );
            })}
          </div>
          }
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
          name="password2"
          outline
          value={this.state.password2}
          onChange={this.changeHandler}
          size="lg"
          />
          <MDBBtn
          color="success"
          className="w-100 py-3 font-weight-bold mx-0"
          onClick={this.handleSubmit}
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

export default compose(
  graphql(CREATE_USER_MUTATION, {
      name: "register"
  })
)(Register);

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */