//> React
// Contains all the functionality necessary to define React components
import React from "react";

// Apollo
import { graphql, withApollo } from "react-apollo";
import * as compose from "lodash.flowright";
import { gql } from "apollo-boost";

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

  handleSubmit = () => {
    this.props.login({
      variables: { "username": this.state.username, "password": sha256(this.state.password) }
    })
    .then(({data}) => {
      //console.log(data);
      if(data.tokenAuth){
        if(data.tokenAuth.token){
          this.props.loginHandler(data.tokenAuth.token);
        }
      }
    })
    .catch((error) => {
      //console.warn("Mutation error:",error.message);
    });
  }

  render(){
    return(
      <MDBCard id="login" className="text-dark">
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
