//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Encrypting
import sha256 from "js-sha256";
// Text animations
import TextLoop from "react-text-loop";

import RSA, { GithubProvider } from "snek-intel/lib/utils/oauth";

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
import { ReactComponent as SvgSoftware } from "../../../assets/header/dev.svg";
import { ReactComponent as SvgMedia } from "../../../assets/header/media.svg";

//> CSS
import "./register.scss";

class Register extends React.Component {
  state = {
    step: 0,
    firstname: "",
    lastname: "",
    email: "",
    password1: "",
    password2: "",
    username: "",
    gitlab_username: "",
    gitlab_servers: undefined,
    gitlab_server: "Choose your organisation",
    login_username: "",
    login_password: "",
    sourceList: [],
    usernames: [],
    promoCode: true,
    code: "",
  };

  componentDidMount = () => {
    this.getGitLabServers();
  };

  getGitLabServers = async () => {
    let gitlab_servers = await this.props.registerUser.getGitLabServers();
    this.setState({
      gitlab_servers,
    });
  };

  toggle = () => {
    if (!this.state.modalGitLab) {
      this.setState({
        modalGitLab: true,
      });
    } else {
      this.setState({
        modalGitLab: false,
      });
    }
  };

  handleSelectChange = (e) => {
    this.setState({
      gitlab_server: e[0],
    });
  };

  addGitLab = () => {
    let username = this.state.gitlab_username;
    let server = this.state.gitlab_server;

    if (username.trim() && server.trim()) {
      if (server !== "Choose your organisation") {
        this._connectGitLab(username, "https://" + server);
      }
    }
  };

  _connectGitLab = async (username, platformUrl) => {
    this.setState(
      {
        modalGitLab: false,
        gitlab_username: "",
        gitlab_server: "Choose your organisation",
      },
      () => this.pushToSourceList("gitlab", username, platformUrl)
    );
  };

  connectGitHub = async () => {
    const data = await RSA.acquireTokenAsync(GithubProvider);
    this.pushToSourceList(
      "github",
      data.username,
      "https://api.github.com/graphql",
      data.accessToken
    );
  };

  pushToSourceList = (platformName, username, platformUrl, token) => {
    let sourceList = this.state.sourceList;

    this.addToUsernames(username, platformName);

    sourceList.push({
      id: username.length + platformName.length + username + platformName,
      user: username,
      authorization: token ? "token " + token : null,
      platform: {
        name: platformName,
        url: platformUrl,
      },
    });

    if (platformName === "github") {
      this.setState({
        username,
        hasGitHub: true,
        sourceList,
      });
    } else {
      // Set the new list of user information
      this.setState({
        sourceList,
      });
    }
  };

  addToUsernames = (username, source) => {
    let usernames = this.state.usernames;

    let found = false;
    for (let i = 0; i < usernames.length; i++) {
      if (
        usernames[i].username === username &&
        usernames[i].source === source
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      // Make sure that only GitHub usernames are available for selection
      // This aims to prevent name abuse in the first versions of this application
      usernames.push({
        id: username.length + source.length + username + source,
        username,
        source,
        verified: source === "github" ? true : false,
      });
      this.setState({
        usernames,
      });
    }
  };

  removeSource = (id) => {
    let sourceList = this.state.sourceList.filter(function (obj) {
      return obj.id !== id;
    });
    let usernames = this.state.usernames.filter(function (obj) {
      return obj.id !== id;
    });
    this.setState({
      sourceList,
      usernames,
    });
  };

  handleUserNamePick = (username) => {
    this.setState({
      username,
    });
  };

  testForError = (id) => {
    if (this.state.errors) {
      let rtn = this.state.errors.map((error, i) => {
        if (!Array.isArray(id)) {
          if (error.code === id) {
            return true;
          } else {
            return false;
          }
        } else {
          let innerRtn = id.map((item, ikey) => {
            if (error.code === item) {
              return true;
            } else {
              return false;
            }
          });
          if (innerRtn.includes(true)) {
            return true;
          } else {
            return false;
          }
        }
      });
      if (rtn.includes(true)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  handleChange = (e, id) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => this.removeError(id)
    );
  };

  handleChangeManual = (name, value, id) => {
    this.setState(
      {
        [name]: value,
      },
      () => this.removeError(id)
    );
  };

  removeError = (id) => {
    // Preset errors to local variable
    let errors = this.state.errors;

    if (errors) {
      if (!Array.isArray(id)) {
        errors = errors.filter(function (obj) {
          return obj.code !== id;
        });
      } else {
        id.map((item) => {
          errors = errors.filter(function (obj) {
            return obj.code !== item;
          });
        });
      }

      this.setState({
        errors,
      });
    }
  };

  // Handle sumbit with JWT, send to engine.snek.at/api/graphiql
  handleSubmit = async () => {
    console.log("Handle submit");
    // CHANGE TO CONST
    let {
      password1,
      password2,
      firstname,
      lastname,
      email,
      sourceList,
      username,
      promoCode,
      code,
    } = this.state;

    // Error
    let errors = [];

    // Check if passwords match
    if (password1 !== "" && password2 !== "" && password1 !== password2) {
      errors.push({
        code: 1,
        msg: "Your passwords do not match.",
        weight: 10,
      });
    }
    if (sourceList.length === 0) {
      errors.push({
        code: 2,
        msg: "No platforms are connected.",
        weight: 10,
      });
    }
    if (firstname === "") {
      errors.push({
        code: 3,
        msg: "Please enter your first name.",
        weight: 8,
      });
    }
    if (lastname === "") {
      errors.push({
        code: 4,
        msg: "Please enter your last name.",
        weight: 8,
      });
    }
    if (email === "") {
      errors.push({
        code: 5,
        msg: "Please enter your email.",
        weight: 9,
      });
    }
    if (username === "") {
      errors.push({
        code: 6,
        msg: "Please select a username from the list above.",
        weight: 10,
      });
    }
    if (password1 === "") {
      errors.push({
        code: 7,
        msg: "Please enter a password.",
        weight: 10,
      });
    }
    if (password2 === "") {
      errors.push({
        code: 8,
        msg: "Please repeat your password.",
        weight: 10,
      });
    }
    if (code === "") {
      errors.push({
        code: 9,
        msg: "Please enter your promo code or contact us to receive one.",
        weight: 5,
      });
    }

    if (errors.length === 0) {
      this.setState(
        {
          loading: true,
        },
        () => {
          // Cache data
          let cache = {};
          console.log("Register", this.state);
          let registrationData = {
            sources: sourceList,
            username,
            email,
            first_name: firstname,
            last_name: lastname,
            gift_code: promoCode && code !== "" ? code : null,
            password: sha256(password1),
          };
          this.props.registerUser.register(registrationData);
        }
      );
    } else {
      this.setState({
        errors,
      });
    }
  };

  handleCodeChange = (e) => {
    let code = e.target.value;

    if (code.length <= 14) {
      if (code.length === 4 || code.length === 9) {
        code = code + "-";
      }
      this.setState(
        {
          code: code.toUpperCase(),
        },
        () => this.removeError(9)
      );
    } else {
      return false;
    }
  };

  login = async (event) => {
    // Prevent page from reloading
    event.preventDefault();
    event.stopPropagation();

    let errors = [];

    if (this.state.login_username === "") {
      errors.push({
        code: 20,
        weight: 10,
      });
    }
    if (this.state.login_password === "") {
      errors.push({
        code: 21,
        weight: 10,
      });
    }

    // Check if there are any errors
    if (errors.length > 0) {
      this.setState({
        errors,
      });
    } else {
      // Proceed to login
      const result = await this.props.login(
        this.state.login_username,
        sha256(this.state.login_password)
      );
      console.log(result);
      if (result) {
        this.props.handleLogin(result);
      } else {
        // Login fail
        //handleLogin(false);
        this.setState({
          loginFail: true,
        });
      }
    }
  };

  render() {
    const { globalState } = this.props;

    return (
      <div className="text-center" id="register">
        {this.state.step === 0 && (
          <>
            <MDBBtn color="green" onClick={() => this.setState({ step: 3 })}>
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
                <div
                  className="selectType"
                  onClick={() => this.setState({ step: 1 })}
                >
                  <p className="lead">Software Engineer</p>
                  <SvgSoftware />
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div
                  className="selectType"
                  onClick={() => this.setState({ step: 2 })}
                >
                  <p className="lead">Media Engineer</p>
                  <SvgMedia />
                </div>
              </MDBCol>
            </MDBRow>
          </>
        )}
        {this.state.step === 1 && (
          <>
            {!this.state.loading ? (
              <>
                <div className="text-left">
                  <small
                    className="text-muted clickable"
                    onClick={() => this.setState({ step: 0, errors: [] })}
                  >
                    <MDBIcon icon="angle-left" className="mr-1" />
                    Back
                  </small>
                </div>
                <p className="lead">So you're a Software Engineer...</p>
                <p className="text-muted mb-4">
                  We just need a bit more information to get you started.
                </p>
                <form>
                  <MDBRow>
                    <MDBCol md="6">
                      <input
                        type="text"
                        className={
                          this.testForError(3)
                            ? "form-control error"
                            : "form-control"
                        }
                        placeholder="Firstname"
                        name="firstname"
                        onChange={(e) => this.handleChange(e, 3)}
                        value={this.state.firstname}
                      />
                    </MDBCol>
                    <MDBCol md="6">
                      <input
                        type="text"
                        className={
                          this.testForError(4)
                            ? "form-control error"
                            : "form-control"
                        }
                        placeholder="Lastname"
                        name="lastname"
                        onChange={(e) => this.handleChange(e, 4)}
                        value={this.state.lastname}
                      />
                    </MDBCol>
                  </MDBRow>
                  <input
                    type="email"
                    className={
                      this.testForError(5)
                        ? "form-control my-2 error"
                        : "form-control my-2"
                    }
                    placeholder="E-Mail"
                    name="email"
                    onChange={(e) => this.handleChange(e, 5)}
                    value={this.state.email}
                  />
                  <MDBRow>
                    <MDBCol md="6">
                      <input
                        type="password"
                        className={
                          this.testForError([7, 1])
                            ? "form-control error"
                            : "form-control"
                        }
                        placeholder="Password"
                        name="password1"
                        onChange={(e) => this.handleChange(e, [7, 1])}
                        value={this.state.password1}
                      />
                    </MDBCol>
                    <MDBCol md="6">
                      <input
                        type="password"
                        className={
                          this.testForError([8, 1])
                            ? "form-control error"
                            : "form-control"
                        }
                        placeholder="Repeat password"
                        name="password2"
                        onChange={(e) => this.handleChange(e, [8, 1])}
                        value={this.state.password2}
                      />
                    </MDBCol>
                  </MDBRow>
                </form>
                <div className="text-left mt-2">
                  <small
                    className="blue-text clickable text-md"
                    onClick={() =>
                      this.setState({ promoCode: !this.state.promoCode })
                    }
                  >
                    {!this.state.promoCode
                      ? "I have a promo code"
                      : "I don't have a promo code"}
                  </small>
                </div>
                {this.state.promoCode && (
                  <input
                    value={this.state.code}
                    className={
                      this.testForError([9, 1])
                        ? "form-control mb-3 error"
                        : "form-control mb-3"
                    }
                    spellCheck="false"
                    autoComplete="autocomplete_off_874548537585743884357"
                    onChange={this.handleCodeChange}
                    type="text"
                    id="materialFormRegisterConfirmEx40"
                    name="code"
                    placeholder="Promo code"
                    label="Promotional code"
                  />
                )}
                <p className="text-muted mt-4">Connect your work</p>
                <small className="text-muted">
                  You need to connect at least one account to continue.
                </small>
                <div>
                  <MDBPopover placement="top" popover clickable id="popper1">
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
                        To generate your expressive and meaningful profile, we
                        require data about your work, which we acquire by
                        fetching it from platforms like GitHub, GitLab and
                        BitBucket. It also helps us verify your data.
                        <br />
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
                    onClick={() => this.setState({ modalGitLab: true })}
                  >
                    <MDBIcon fab icon="gitlab" size="lg" />
                  </MDBBtn>
                  <MDBBtn color="elegant" onClick={this.connectGitHub}>
                    <MDBIcon fab icon="github" size="lg" />
                  </MDBBtn>
                  <MDBBtn color="primary" disabled>
                    <MDBIcon fab icon="bitbucket" size="lg" />
                  </MDBBtn>
                </div>
                <div>
                  <MDBListGroup>
                    {this.state.usernames.map((source, i) => {
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
                                      <MDBCol
                                        size="auto"
                                        className="p-0 green-text"
                                      >
                                        <MDBIcon icon="award" size="3x" />
                                      </MDBCol>
                                      <MDBCol className="p-0 pl-3">
                                        This source has been{" "}
                                        <strong className="green-text">
                                          verified
                                        </strong>{" "}
                                        by logging into it.
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
                                  <MDBPopoverHeader>
                                    Not verified
                                  </MDBPopoverHeader>
                                  <MDBPopoverBody>
                                    <MDBRow className="justify-content-center align-items-center m-0">
                                      <MDBCol
                                        size="auto"
                                        className="p-0 grey-text"
                                      >
                                        <MDBIcon icon="award" size="3x" />
                                      </MDBCol>
                                      <MDBCol className="p-0 pl-3">
                                        We can not verify your identity with
                                        GitLab. Your data is still being
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
                <MDBBtn
                  color="green"
                  className="mb-0"
                  onClick={this.handleSubmit}
                  /*disabled={!this.state.hasGitHub}*/
                >
                  Join now
                </MDBBtn>
                <p>
                  <small className="text-muted">
                    Don't worry, you can easily connect further accounts in the
                    future.
                  </small>
                </p>
              </>
            ) : (
              <div className="my-5 py-5">
                <h2 className="font-weight-bolder mb-0">
                  Hey, {this.state.firstname}!
                </h2>
                <p className="lead mb-3">Your profile is being generated.</p>
                <div className="progress md-progress primary-color mb-1">
                  <div className="indeterminate"></div>
                </div>
                <TextLoop
                  className="text-muted"
                  children={[
                    "Connecting profiles...",
                    "Fetching data...",
                    "Creating profile...",
                    "Analyzing profile...",
                    "Creating statistics...",
                    "Warming up the coffee...",
                    "Finishing your profile...",
                  ]}
                  springConfig={{ stiffness: 180, damping: 8 }}
                  interval={4000}
                />
              </div>
            )}
          </>
        )}
        {this.state.step === 2 && (
          <>
            <div className="text-left">
              <small
                className="text-muted clickable"
                onClick={() => this.setState({ step: 0 })}
              >
                <MDBIcon icon="angle-left" className="mr-1" />
                Back
              </small>
            </div>
            <p className="lead">So you're a Media Engineer...</p>
            <p className="text-muted mb-3">
              We just need a bit more information to get you started.
            </p>
            <MDBRow>
              <MDBCol md="6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firstname"
                  name="firstname"
                  onChange={(e) =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  value={this.state.firstname}
                />
              </MDBCol>
              <MDBCol md="6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lastname"
                  name="lastname"
                  onChange={(e) =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  value={this.state.lastname}
                />
              </MDBCol>
            </MDBRow>
            <input
              type="email"
              className="form-control my-2"
              placeholder="E-Mail"
              name="email"
              onChange={(e) =>
                this.setState({ [e.target.name]: e.target.value })
              }
              value={this.state.email}
            />
            <p className="text-muted mt-4">Connect your work</p>
            <small className="text-muted">
              You need to connect at least one account to continue.
            </small>
            <div>
              <MDBPopover placement="top" popover clickable id="popper1">
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
                    To generate your expressive and meaningful profile, we
                    require data about your work, which we acquire by fetching
                    it from platforms like GitHub, GitLab and BitBucket. It also
                    helps us verify your data.
                    <br />
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
              <MDBBtn color="ins">
                <MDBIcon fab icon="instagram" size="lg" />
              </MDBBtn>
              <MDBBtn color="fb" disabled>
                <MDBIcon fab icon="facebook-f" size="lg" />
              </MDBBtn>
              <MDBBtn color="li" disabled>
                <MDBIcon fab icon="linkedin-in" size="lg" />
              </MDBBtn>
              <MDBBtn color="slack" disabled>
                <MDBIcon fab icon="xing" size="lg" />
              </MDBBtn>
            </div>
            <MDBBtn color="green" className="mb-0">
              Join now
            </MDBBtn>
            <p>
              <small className="text-muted">
                Don't worry, you can easily connect further accounts in the
                future.
              </small>
            </p>
          </>
        )}
        {this.state.step === 3 && (
          <>
            <div className="text-left">
              <small
                className="text-muted clickable"
                onClick={() => this.setState({ step: 0 })}
              >
                <MDBIcon icon="angle-left" className="mr-1" />
                Back
              </small>
            </div>
            <p className="lead">Login to SNEK</p>
            {this.state.loginFail && (
              <MDBAlert color="danger" className="mt-3 mb-3">
                Can not perform login. Please check your username and password.
              </MDBAlert>
            )}
            <form onSubmit={this.login}>
              <input
                type="text"
                className={
                  this.testForError(20)
                    ? "form-control my-2 error"
                    : "form-control my-2"
                }
                placeholder="Username"
                name="username"
                onChange={(e) =>
                  this.handleChangeManual("login_username", e.target.value, 20)
                }
                value={this.state.login_username}
              />
              <input
                type="password"
                className={
                  this.testForError(21)
                    ? "form-control my-2 error"
                    : "form-control my-2"
                }
                placeholder="Password"
                name="password"
                onChange={(e) =>
                  this.handleChangeManual("login_password", e.target.value, 21)
                }
                value={this.state.login_password}
              />
              {globalState.user === false && <p>Login fehlerhaft</p>}
              <MDBBtn color="green" className="mb-0" type="submit">
                Login
                <MDBIcon icon="angle-right" className="pl-1" />
              </MDBBtn>
            </form>
          </>
        )}
        {this.state.modalGitLab && (
          <MDBModal
            modalStyle="orange"
            className="text-white"
            size="sm"
            backdrop={true}
            isOpen={this.state.modalGitLab}
            toggle={this.toggle}
          >
            <MDBModalHeader className="text-center" titleClass="w-100" tag="p">
              <MDBIcon fab icon="gitlab" className="pr-2" />
              Add GitLab profile
            </MDBModalHeader>
            <MDBModalBody className="text-center">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="GitLab username"
                name="gitlab_username"
                onChange={(e) =>
                  this.setState({ [e.target.name]: e.target.value })
                }
                value={this.state.gitlab_username}
              />
              <MDBSelect
                outline
                getValue={this.handleSelectChange}
                className="mb-0"
              >
                <MDBSelectInput selected={this.state.gitlab_server} />
                <MDBSelectOptions>
                  <MDBSelectOption disabled>
                    Choose your organisation
                  </MDBSelectOption>
                  {this.state.gitlab_servers &&
                    this.state.gitlab_servers.map((source, i) => {
                      return (
                        <MDBSelectOption key={i} value={source.domain}>
                          {source.organisation}
                        </MDBSelectOption>
                      );
                    })}
                </MDBSelectOptions>
              </MDBSelect>
            </MDBModalBody>
            <MDBModalFooter className="justify-content-center">
              <MDBBtn color="orange" onClick={this.addGitLab}>
                <MDBIcon icon="plus-circle" className="mr-2" />
                Add
              </MDBBtn>
              <MDBBtn color="elegant" outline onClick={this.toggle}>
                Cancel
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        )}
      </div>
    );
  }
}

export default Register;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
