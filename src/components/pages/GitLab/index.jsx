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
} from "mdbreact";

class GitLab extends React.Component {
  state = {
    username: "",
    server: "",
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = () => {
    if (this.state.username !== "")
    {
      if (this.state.server !== "")
      {
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
        <MDBInput 
        label="Server"
        type="text"
        name="server"
        outline
        size="lg"
        value={this.state.server}
        onChange={this.changeHandler}
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
export default GitLab;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
