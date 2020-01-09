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
  MDBIcon,
  toast,
  ToastContainer,
  MDBSelect,
} from "mdbreact";

class GitLabPage extends React.Component {
  state = {
    username: "",
    server: "",
    options: [
      {
        text: "HTL Villach",
        value: "gitlab.htl-villach.at"
      }
    ]
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  changeSelection = event => {
    this.setState({
      server: event[0]
    });
  }

  // Handle sumbit with JWT, send to engine.snek.at/api/graphiql
  handleSubmit = () => {
    if (this.state.username !== "")
    {
      if (this.state.server !== "")
      {
        this.state.username = this.state.username.replace(/\./g,"__");
        this.state.server = this.state.server.replace(/\./g,"__");
        window.open(`https://snek.at/redirect?server=${this.state.server}&username=${this.state.username}`, "_self");
      }
      else{
        this.notify("warn","Enter a server!");
      }
    }
    else{
      this.notify("warn","Enter a username!");
    }
  }

  notify = (type, message) => {
    if (type === "success") {
      toast.success(
        <div>
          <MDBIcon
          icon="lock-open"
          className="text ml-2 cursor-pointer"
          />
          {message}
        </div>
      );
    }
    if (type === "error"){
      toast.error(
        <div>
          <MDBIcon
          icon="lock"
          className="text ml-2 cursor-pointer"
          />
          {message}
        </div>
      );
    }
    if (type === "warn"){
      toast.warn(
        <div>
          <MDBIcon
          icon="exclamation-triangle"
          className="text ml-2 cursor-pointer"
          />
          {message}
        </div>
      );
    }
  }

  render() {
    return(
      <MDBCard id="gitlab" className="text-dark">
      <ToastContainer
        hideProgressBar={true}
        newestOnTop={true}
        autoClose={5000}
      />
      <MDBCardBody>
        <h2>GitLab</h2>
        <MDBInput
        label="Username"
        type="text"
        name="username"
        outline
        size="lg"
        value={this.state.username}
        onChange={this.changeHandler}
        />
        <MDBSelect
          search
          options={this.state.options}
          value={this.state.server}
          getValue={this.changeSelection}
          className="select-server"
          selected="Choose your server"
          label="Your server"
          labelClass="text-white"
          outline
          required
        />
        <MDBBtn
        color="success"
        className="w-100 py-3 font-weight-bold mx-0"
        onClick={this.handleSubmit}
        >
        Sign in
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
    );
  }
}

export default GitLabPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
