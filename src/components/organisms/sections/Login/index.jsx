//> React
// Contains all the functionality necessary to define React components
import React from "react";

// Apollo
import { graphql, withApollo } from "react-apollo";
import * as compose from "lodash.flowright";
import { gql } from "apollo-boost";

//> Additional modules
// Used to hash the password with SHA256
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
  toast,
  ToastContainer,
  MDBToast,
} from "mdbreact";

//> Queries / Mutations
// Get the JWT token
const LOGIN_USER = gql`
  mutation tokenAuth($username: String!, $password: String!){
    tokenAuth(username:$username,password:$password){
      token
    }
  }
`;

class Login extends React.Component{
  state = {
    username: "",
    password: "",
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // Handle sumbit with JWT, send to engine.snek.at/api/graphiql
  handleSubmit = () => {
    this.props.login({
      variables: { "username": this.state.username, "password": sha256(this.state.password) }
    })
    .then(({data}) => {
      if(data.tokenAuth){
        if(data.tokenAuth.token){
          this.props.loginHandler(data.tokenAuth.token);
          this.notify("success", " Successfull login!");
        }
      }
    })
    .catch((error) => {
      this.notify("error", error.message.split(":")[1]);
    });
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
  };

  render(){
    return(
      <MDBCard id="login" className="text-dark">
        <ToastContainer
        hideProgressBar={true}
        newestOnTop={true}
        autoClose={5000}
        />
        <MDBCardBody>
          <h2>Sign in</h2>
          <MDBInput
          label="Username"
          type="text"
          name="username"
          outline
          value={this.state.username}
          onChange={this.changeHandler}
          size="lg"
          />
          <MDBInput 
          label="Password"
          type="password"
          name="password"
          outline
          value={this.state.password}
          onChange={this.changeHandler}
          size="lg"
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

export default compose(
  graphql(LOGIN_USER, { name: "login" }),
)(withApollo(Login));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
