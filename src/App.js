//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Components
/**
 * Footer: Global Footer
 * Navbar: Global navigation bar
 */
import {
  Navbar,
} from "./components/molecules";

import * as intel from "./intel";

//> Routes
import Routes from "./Routes";

// Apollo
import { graphql, withApollo } from "react-apollo";
import * as compose from "lodash.flowright";
import { gql } from "apollo-boost";

//> Test
// A test with the user "torvalds"
import "./App.test";

//> Queries / Mutations
// Verify the token
const VERIFY_TOKEN = gql`
  mutation verify($token: String!) {
      verifyToken(token: $token) {
      payload
      }
  }
`;
// Refresh the token
const REFRESH_TOKEN = gql`
  mutation refresh($token: String!) {
    refreshToken(token: $token) {
      payload
      token
    }
  }
`;
// Login anonymous user
const LOGIN_USER = gql`
    mutation tokenAuth{
        tokenAuth(username:"cisco",password:"ciscocisco"){
            token
        }
    }
`;

class App extends React.Component {

  // Init state
  state = {
    contrib: null,
    contribCalendar: null,
    contribTypes: null,
    user: null,
    languages: null,
    repos: null,
    token: "",
    loaded: false,
  };

  componentDidMount = () => {
    /*intel.fill({
      username: "pinterid",
      server: "gitlab.htl-villach.at",
      platformName: "GitLab"
    })
    .then(() => {
      console.log(intel.templateGetPlatform());
      console.log(intel.user());
      console.log(intel.repos());
      console.log(intel.orgs());
      console.log(intel.languages());
      console.log(intel.calendar());
    });*/
    // Fill with data
    this.setState({
      contrib: null,
      contribCalendar: null,
      contribTypes: null,
      user: null,
      languages: null,
      repos: null,
    });

    if(localStorage.getItem('fprint') !== null){
      try {
        // Verify Token on first load
        this._verifyToken();
        // Refresh token every 4 minutes
        setInterval(async () => {
          this._verifyToken();
        }, 240000);
      } catch(e) {
        console.log(e);
      }
    } else {
      this._loginUser();
    }
  }

  _verifyToken = () => {
    this.props.verify({
      variables: { "token": localStorage.getItem('fprint') }
    })
    .then(({data}) => {
        if(data !== undefined){
          if(data.verifyToken !== null){
            this._isLogged(
              data.verifyToken.payload.exp,
              data.verifyToken.payload.origIat,
              localStorage.getItem('fprint')
            );
          } else {
            console.warn("No token in payload.");
          }
        } else {
          console.warn("No token in payload.");
        }
    })
    .catch(error => {
        console.warn("Mutation error:",error);
    })
  }

  _loginUser = () => {
    this.props.login()
    .then(({data}) => {
        if(data !== undefined){
          this._setLogged(data.tokenAuth.token);
        }
    })
    .catch(error => {
        console.error("Mutation error:",error);
    })
  }

  _setLogged = (token) => {
    this.setState({
      token: token,
      loaded: true,
    }, () => localStorage.setItem('fprint', token));
  }

  _isLogged = (exp, orig, token) => {
    /**
     * Generate current timestamp
     * Ref: https://flaviocopes.com/how-to-get-timestamp-javascript/
     */
    let currentTS = ~~(Date.now() / 1000);
    // Check if the token is still valid
    if(currentTS > exp){
      // Token has expired
      this._refeshToken(token);
    } else {
      // Only if anything has changed, update the data
      this._setLogged(token);
    }
  }

  _refeshToken = (token) => {
    this.props.refresh({
      variables: { "token": token }
    })
    .then(({data}) => {
        if(data !== undefined){
          localStorage.setItem('fprint', data.refreshToken.token);
        }
    })
    .catch(error => {
        console.warn("Mutation error:",error);
    })
  }

  render() {
    // Debugging
    //console.log(this.state);
    
    // Check if every state is set
    if(
      !this.state.contrib && 
      !this.state.contribCalendar &&
      !this.state.contribTypes &&
      !this.state.user &&
      !this.state.languages &&
      !this.state.repos
    ){
      return (
        <Router>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes
              data={this.state}
              />
            </main>
            {/*
            <Footer />
            */}
          </div>
        </Router>
      );
    } else {
      return null;
    }
  }
}

export default compose(
  graphql(VERIFY_TOKEN, { name: 'verify' }),
  graphql(REFRESH_TOKEN, { name: 'refresh' }),
  graphql(LOGIN_USER, { name: 'login' }),
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
