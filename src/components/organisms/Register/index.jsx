//> React
// Contains all the functionality necessary to define React components
import React from "react";

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
} from "mdbreact";

//> Images
import { ReactComponent as SvgSoftware } from '../../../assets/header/dev.svg';
import { ReactComponent as SvgMedia } from '../../../assets/header/media.svg';

//> CSS
import "./register.scss";

class Register extends React.Component {
  state = {
    step: 0
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

  render() {
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
              <select className="browser-default custom-select form-control">
                <option>Choose your GitLab Server</option>
                <option value="1">gitlab.htl-villach.at</option>
              </select>
            </MDBModalBody>
            <MDBModalFooter className="justify-content-center">
              <MDBBtn
              color="green"
              onClick={() => console.log("Init GitLab fetching")}
              >
              <MDBIcon
              icon="check"
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
