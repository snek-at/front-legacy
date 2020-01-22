//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Additional
// Crypto
import sha256 from "js-sha256";

//> Components
import {
  Navbar,
  Footer,
} from "./components/organisms";
import {
  ScrollToTop,
} from './components/atoms';

//> Backend Connection
// Apollo
import { graphql, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as compose from 'lodash.flowright';

//> Routes
import Routes from "./Routes";

//> Queries and Mutations
// Login
const LOGIN_USER = gql`
  mutation tokenAuth($username: String!, $password: String!){
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;
// Verify token
const VERIFY_TOKEN = gql`
  mutation verify($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;
// Refresh token
const REFRESH_TOKEN = gql`
  mutation refresh($token: String!) {
    refreshToken(token: $token) {
      payload
      token
    }
  }
`;
// Get user data
const GET_USER_DATA = gql`
  query profile($url: String!){
    profile: page(url: $url){
      ...on ProfileProfilePage{
        platformData
        sources
      }
    }
  }
`;

class App extends React.Component {

  state = {
    logged: false,
    user: undefined,
  }

  componentDidMount = () => {
    // Check if there is a token
    if(localStorage.getItem('jwt_snek')){
      this._verifyToken();
    } else {
      this._loginAnonymous();
    }
  }

  _verifyToken = async () => {
    console.log("Verifying");
    await this.props.verify({
      variables: { "token": localStorage.getItem('jwt_snek') }
    }).then(({data}) => {
      console.log(data);
      if(data){
        if(data.verifyToken){
          console.log("Verified");
          let username = data.verifyToken.payload.username;
          // Check if it's not the anonymous user
          if(username !== process.env.REACT_APP_ANONYMOUS_USER){
            this._getData(data.verifyToken.payload.username);
          }
        } else {
          console.log("Not verified 1");
          // Try to revive token
          this._refeshToken();
        }
      } else {
        console.log("Not verified 2");
        // Try to revive token
        this._refeshToken();
      }
    }).catch(error => {
      console.error(error);
      // Try to revive token
      this._refeshToken();
    })
  }

  _refeshToken = () => {
    console.log("Refresh token");
    this.props.refresh({
      variables: { "token": localStorage.getItem('jwt_snek') }
    }).then(({data}) => {
      console.log(data);
        if(data !== undefined){
          localStorage.setItem('jwt_snek', data.refreshToken.token);
        }
    }).catch(error => {
      console.error(error);
      // Login anonymous user - Member is signed out
      this.setState({
        logged: false,
        user: false,
      }, () => this._loginAnonymous());
    })
  }

  _getData = async (username) => {
    console.log(username);
    await this.props.client.query({
      query: GET_USER_DATA,
      variables: { "url": "/registration/"+username }
    }).then(({data}) => {
      console.log(data);
    }).catch(error => {
      console.error(error);
    })
  }

  _loginAnonymous = async () => {
    console.log("Login anonymous");
    await this.props.login({ 
      variables: { 
        "username": process.env.REACT_APP_ANONYMOUS_USER,
        "password": process.env.REACT_APP_ANONYMOUS_PASS
      }
    }).then(({ loading, data }) => {
      if(data){
        if(data.tokenAuth){
          if(data.tokenAuth.token){
            localStorage.setItem('jwt_snek', data.tokenAuth.token);
          }
        }
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  _login = async (username, password) => {
    console.log(username, password);

    await this.props.login({ 
      variables: { 
        "username": username,
        "password": sha256(password)
      }
    }).then(({ loading, data }) => {
      console.log(data);
      if(data){
        if(data.tokenAuth){
          if(data.tokenAuth.token){
            localStorage.setItem('jwt_snek', data.tokenAuth.token);
          }
        }
      }
    }).catch((loading, error) => {
      // Username or password is wrong
      console.error(error);
    });
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes logmein={this._login}/>
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default compose(
  graphql(VERIFY_TOKEN, { name: 'verify' }),
  graphql(REFRESH_TOKEN, { name: 'refresh' }),
  graphql(LOGIN_USER, {name: 'login'}),
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
