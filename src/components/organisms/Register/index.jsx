//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
import sha256 from "js-sha256";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBAlert,
  MDBBtn,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBListGroup,
  MDBListGroupItem,
} from "mdbreact";

//> Images
import { ReactComponent as SvgSoftware } from '../../../assets/header/dev.svg';
import { ReactComponent as SvgMedia } from '../../../assets/header/media.svg';

//> CSS
import "./register.scss";

//> Intel
import * as intel from "../../../intel";

//> Auth
import { githubProvider } from "../../../intel/OAuthGithub/providers/github";
import RSA from "react-very-simple-oauth";

class Register extends React.Component {
  state = {
    step: 0,
    gitlab_username: "",
    gitlab_server: "Choose your organisation",
    sourceList: [],
    usernames: [],
    hasGitHub: false,
  };

  toggle = () => {
    if(!this.state.modalGitLab){
      this.setState({
        modalGitLab: true
      });
    } else {
      this.setState({
        modalGitLab: false
      });
    }
  }

  handleSelectChange = (e) => {
    this.setState({
      gitlab_server: e[0]
    });
  }

  addGitLab = () => {
    let username = this.state.gitlab_username;
    let server = this.state.gitlab_server;

    if(username.trim() && server.trim()){
      if(server !== "Choose your organisation"){
        this._connectGitLab(username, server);
      }
    }
  }

  _connectGitLab = async (username, server) => {
    this.setState({
      modalGitLab: false,
      gitlab_username: "",
      gitlab_server: "Choose your organisation",
    }, () => this.pushToSourceList("gitlab", username, server));
  }

  connectGitHub = async () => {
    const data = await RSA.acquireTokenAsync(githubProvider);
    console.log(data);
    this.pushToSourceList("github", data.username, "github.com", data.access_token);
  }

  pushToSourceList = (source, username, server, token) => {
    let hasGitHub = false;
    let sourceList = this.state.sourceList;

    this.addToUsernames(username, source);

    if(source === "github"){
      hasGitHub = true;
    }

    sourceList.push({
      id: username.length + source.length + username + source,
      source,
      username,
      server,
      token,
    });
    
    // Set the new list of user information
    this.setState({
      sourceList,
      hasGitHub,
    });
  }

  addToUsernames = (username, source) => {
    let usernames = this.state.usernames;
    
    let found = false;
    for(let i = 0; i < usernames.length; i++) {
      if (usernames[i].username === username && usernames[i].source === source) {
        found = true;
        break;
      }
    }

    if(!found){
      // Make sure that only GitHub usernames are available for selection
      // This aims to prevent name abuse in the first versions of this application
      usernames.push({
        id: username.length + source.length + username + source,
        username,
        source,
        verified: source === "github" ? true : false,
      });
      this.setState({
        usernames
      });
    }
  }

  removeSource = (id) => {
    let sourceList = this.state.sourceList.filter(function( obj ) {
        return obj.id !== id;
    });
    let usernames = this.state.usernames.filter(function( obj ) {
        return obj.id !== id;
    });
    this.setState({
      sourceList,
      usernames,
    });
  }

  handleUserNamePick = (username) => {
    this.setState({
      username
    });
  }

  // Handle sumbit with JWT, send to engine.snek.at/api/graphiql
  handleSubmit = async () => {
    // Cache data
    let cache = {};
    intel
    .fill(this.state.sourceList)
    .then(() => {
      intel.calendar();
      intel.stats();
      intel.repos();
    })
    .then(() => {
      cache = {
        logged: true,
        contrib: intel.stats(),
        contribCalendar: intel.calendar(),
        contribTypes: intel.contribTypes(),
        user: intel.user(),
        orgs: intel.orgs(),
        languages: intel.languages(),
        repos: intel.repos(),
      };
    })
    .then(() => {
      let values = {
        sources: JSON.stringify(this.state.sourceList),
        username: "Aichnerc",
        email: "contact@aichner-christian.com",
        first_name: this.state.firstname,
        last_name: this.state.lastname,
        password: sha256(this.state.password),
        "platform_data": JSON.stringify(cache)
      };
      this.props.register(values);
    });
  }

  render() {
    const { gitlabServers } = this.props;
    console.log(this.state);

    return (
      <div className="text-center" id="register">
        {this.state.step === 0 &&
          <>
            <MDBBtn
            color="green"
            onClick={() => this.setState({step: 3})}
            >
            Login to SNEK
            </MDBBtn>
            <div className="w-100">
              <div className="splitter my-4">
                <span className="or">
                  <span className="or-text">or</span>
                </span>
              </div>
            </div>
            <h2 className="mb-0">Choose your snek</h2>
            <p className="text-muted mb-3">What is your main profession?</p>
            <MDBRow>
              <MDBCol md="6">
                <div className="selectType" onClick={() => this.setState({step: 1})}>
                  <p className="lead">Software Engineer</p>
                  <SvgSoftware />
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div className="selectType" onClick={() => this.setState({step: 2})}>
                <p className="lead">Media Engineer</p>
                  <SvgMedia />
                </div>
              </MDBCol>
            </MDBRow>
          </>
        }
        {this.state.step === 1 &&
          <>
            <div className="text-left">
              <small className="text-muted clickable" onClick={() => this.setState({step: 0})}>
                <MDBIcon icon="angle-left" className="mr-1" />
                Back
              </small>
            </div>
            <p className="lead">So you're a Software Engineer...</p>
            <p className="text-muted mb-4">We just need a bit more information to get you started.</p>
            <form>
            <MDBRow>
              <MDBCol md="6">
                <input 
                type="text"
                className="form-control"
                placeholder="Firstname"
                name="firstname"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.firstname}
                />
              </MDBCol>
              <MDBCol md="6">
                <input 
                type="text"
                className="form-control"
                placeholder="Lastname"
                name="lastname"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.lastname}
                />
              </MDBCol>
            </MDBRow>
            <input 
            type="email"
            className="form-control my-2"
            placeholder="E-Mail"
            name="email"
            onChange={(e) => this.setState({[e.target.name]: e.target.value})}
            value={this.state.email}
            />
            <MDBRow>
              <MDBCol md="6">
                <input 
                type="password"
                className="form-control"
                placeholder="Password"
                name="password1"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.password1}
                />
              </MDBCol>
              <MDBCol md="6">
                <input 
                type="password"
                className="form-control"
                placeholder="Repeat password"
                name="password2"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.password2}
                />
              </MDBCol>
            </MDBRow>
            </form>
            <p className="text-muted mt-4">Connect your work</p>
            <small className="text-muted">You need to connect at least one account to continue.</small>
            <div>
              <MDBPopover
                placement="top"
                popover
                clickable
                id="popper1"
              >
                <MDBBtn color="link" className="text-muted py-1">
                <MDBIcon far icon="question-circle" className="pr-1" />
                Why do I need to connect my accounts?
                </MDBBtn>
                <div>
                  <MDBPopoverHeader>
                  <MDBIcon far icon="question-circle" className="pr-2" />
                  Connecting accounts
                  </MDBPopoverHeader>
                  <MDBPopoverBody>
                    To generate your expressive and meaningful profile, we require data about your work, 
                    which we acquire by fetching it from platforms like GitHub, GitLab and BitBucket. It 
                    also helps us verify your data.<br/>
                    <a 
                    className="blue-text"
                    href="https://github.com/snek-at"
                    rel="noopener noreferrer"
                    target="_blank"
                    >
                    Learn more
                    </a>
                  </MDBPopoverBody>
                </div>
              </MDBPopover>
            </div>
            <div className="connect mb-3">
              <MDBBtn
              color="orange"
              onClick={() => this.setState({modalGitLab: true})}
              >
              <MDBIcon fab icon="gitlab" size="lg"/>
              </MDBBtn>
              <MDBBtn
              color="elegant"
              onClick={this.connectGitHub}
              >
              <MDBIcon fab icon="github" size="lg"/>
              </MDBBtn>
              <MDBBtn
              color="primary"
              disabled
              >
              <MDBIcon fab icon="bitbucket" size="lg"/>
              </MDBBtn>
            </div>
            <div>
              <MDBListGroup>
              {this.state.usernames.map((source, i) => {
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
                    {source.verified ? (
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
                        icon="award"
                        className="green-text ml-2 clickable"
                        />
                        </span>
                        <div>
                          <MDBPopoverHeader>Verified</MDBPopoverHeader>
                          <MDBPopoverBody>
                            <MDBRow className="justify-content-center align-items-center m-0">
                              <MDBCol size="auto" className="p-0 green-text">
                                <MDBIcon icon="award" size="3x" />
                              </MDBCol>
                              <MDBCol className="p-0 pl-3">
                              This source has been <strong className="green-text">verified</strong> by 
                              logging into it.
                              </MDBCol>
                            </MDBRow>
                          </MDBPopoverBody>
                        </div>
                      </MDBPopover>
                    ) : (
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
                        icon="award"
                        className="grey-text ml-2 clickable"
                        />
                        </span>
                        <div>
                          <MDBPopoverHeader>Not verified</MDBPopoverHeader>
                          <MDBPopoverBody>
                            <MDBRow className="justify-content-center align-items-center m-0">
                              <MDBCol size="auto" className="p-0 grey-text">
                                <MDBIcon icon="award" size="3x" />
                              </MDBCol>
                              <MDBCol className="p-0 pl-3">
                              We can not verify your identity with GitLab. Your data is still being 
                              included.
                              </MDBCol>
                            </MDBRow>
                          </MDBPopoverBody>
                        </div>
                      </MDBPopover>
                    )}
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
            {/*this.state.usernames && this.state.usernames.length > 0 &&
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
            </div>*/
            }
            <MDBBtn
            color="green"
            className="mb-0"
            disabled={!this.state.hasGitHub}
            >
            Join now
            </MDBBtn>
            <p>
            <small className="text-muted">Don't worry, you can easily connect further accounts in the future.</small>
            </p>
          </>
        }
        {this.state.step === 2 &&
          <>
            <div className="text-left">
              <small className="text-muted clickable" onClick={() => this.setState({step: 0})}>
                <MDBIcon icon="angle-left" className="mr-1" />
                Back
              </small>
            </div>
            <p className="lead">So you're a Media Engineer...</p>
            <p className="text-muted mb-3">We just need a bit more information to get you started.</p>
            <MDBRow>
              <MDBCol md="6">
                <input 
                type="text"
                className="form-control"
                placeholder="Firstname"
                name="firstname"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.firstname}
                />
              </MDBCol>
              <MDBCol md="6">
                <input 
                type="text"
                className="form-control"
                placeholder="Lastname"
                name="lastname"
                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                value={this.state.lastname}
                />
              </MDBCol>
            </MDBRow>
            <input 
            type="email"
            className="form-control my-2"
            placeholder="E-Mail"
            name="email"
            onChange={(e) => this.setState({[e.target.name]: e.target.value})}
            value={this.state.email}
            />
            <p className="text-muted mt-4">Connect your work</p>
            <small className="text-muted">You need to connect at least one account to continue.</small>
            <div>
              <MDBPopover
                placement="top"
                popover
                clickable
                id="popper1"
              >
                <MDBBtn color="link" className="text-muted py-1">
                <MDBIcon far icon="question-circle" className="pr-1" />
                Why do I need to connect my accounts?
                </MDBBtn>
                <div>
                  <MDBPopoverHeader>
                  <MDBIcon far icon="question-circle" className="pr-2" />
                  Connecting accounts
                  </MDBPopoverHeader>
                  <MDBPopoverBody>
                    To generate your expressive and meaningful profile, we require data about your work, 
                    which we acquire by fetching it from platforms like GitHub, GitLab and BitBucket. It 
                    also helps us verify your data.<br/>
                    <a 
                    className="blue-text"
                    href="https://github.com/snek-at"
                    rel="noopener noreferrer"
                    target="_blank"
                    >
                    Learn more
                    </a>
                  </MDBPopoverBody>
                </div>
              </MDBPopover>
            </div>
            <div className="connect mb-3">
              <MDBBtn
              color="ins"
              >
              <MDBIcon fab icon="instagram" size="lg"/>
              </MDBBtn>
              <MDBBtn
              color="fb"
              disabled
              >
              <MDBIcon fab icon="facebook-f" size="lg"/>
              </MDBBtn>
              <MDBBtn
              color="li"
              disabled
              >
              <MDBIcon fab icon="linkedin-in" size="lg"/>
              </MDBBtn>
              <MDBBtn
              color="slack"
              disabled
              >
              <MDBIcon fab icon="xing" size="lg"/>
              </MDBBtn>
            </div>
            <MDBBtn
            color="green"
            className="mb-0"
            >
            Join now
            </MDBBtn>
            <p>
            <small className="text-muted">Don't worry, you can easily connect further accounts in the future.</small>
            </p>
          </>
        }
        {this.state.step === 3 &&
          <>
            <div className="text-left">
              <small className="text-muted clickable" onClick={() => this.setState({step: 0})}>
                <MDBIcon icon="angle-left" className="mr-1" />
                Back
              </small>
            </div>
            <p className="lead">Login to SNEK</p>
            <input 
            type="email"
            className="form-control my-2"
            placeholder="E-Mail or Username"
            name="email"
            onChange={(e) => this.setState({[e.target.name]: e.target.value})}
            value={this.state.email}
            />
            <input 
            type="password"
            className="form-control my-2"
            placeholder="Password"
            name="password"
            onChange={(e) => this.setState({[e.target.name]: e.target.value})}
            value={this.state.password}
            />
            <MDBBtn
            color="green"
            className="mb-0"
            onClick={() => this.props.logmein("pinterid", "test")}
            >
            Login
            <MDBIcon icon="angle-right" className="pl-1" />
            </MDBBtn>
          </>
        }
        {this.state.modalGitLab &&
          <MDBModal 
          modalStyle="orange"
          className="text-white"
          size="sm"
          backdrop={true}
          isOpen={this.state.modalGitLab}
          toggle={this.toggle}
          >
            <MDBModalHeader
            className="text-center"
            titleClass="w-100"
            tag="p"
            >
              <MDBIcon fab icon="gitlab" className="pr-2" />
              Add GitLab profile
            </MDBModalHeader>
            <MDBModalBody className="text-center">
              <input 
              type="text"
              className="form-control mb-2"
              placeholder="GitLab username"
              name="gitlab_username"
              onChange={(e) => this.setState({[e.target.name]: e.target.value})}
              value={this.state.gitlab_username}
              />
              <MDBSelect 
              outline
              getValue={this.handleSelectChange}
              className="mb-0"
              >
                <MDBSelectInput selected={this.state.gitlab_server} />
                <MDBSelectOptions>
                  <MDBSelectOption disabled>Choose your organisation</MDBSelectOption>
                  {gitlabServers && gitlabServers.map((source, i) => {
                    return(
                      <MDBSelectOption key={i} value={source.domain}>{source.organisation}</MDBSelectOption>
                    );
                  })}
                  </MDBSelectOptions>
                </MDBSelect>
            </MDBModalBody>
            <MDBModalFooter className="justify-content-center">
              <MDBBtn
              color="orange"
              onClick={this.addGitLab}
              >
              <MDBIcon
              icon="plus-circle"
              className="mr-2"
              />
              Add
              </MDBBtn>
              <MDBBtn color="elegant" outline onClick={this.toggle}>Cancel</MDBBtn>
            </MDBModalFooter>
          </MDBModal>
          }
      </div>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
