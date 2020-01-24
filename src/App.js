//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router, Redirect } from "react-router-dom";

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
  query profile($url: String!, $token: String!){
    profile: page(url: $url, token: $token){
      ...on ProfileProfilePage{
        platformData
        sources
      }
    }
  }
`;
// Get GitLab servers
const GET_GITLAB_SERVERS = gql`
  query gitLabServers($token: String!) {
    page(url: "/registration", token: $token) {
      ... on RegistrationRegistrationFormPage {
        supportedGitlabs {
          ... on RegistrationGitlab_Server {
            organisation
            domain
            field
          }
        }
      }
    }
  }
`;

class App extends React.Component {

  state = {
    logged: false,
    user: undefined,
    gitlab_servers: undefined,
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
            this._getData(data.verifyToken.payload.username, localStorage.getItem('jwt_snek'));
          } else {
            this.setState({
              loading: false,
              logged: false,
              user: false,
            });
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

  _getData = async (username, token) => {
    console.log(username);
    await this.props.client.query({
      query: GET_USER_DATA,
      variables: { 
        "url": "/registration/"+username,
        "token": token
      }
    }).then(({data}) => {
      console.log(data);
      this.setState({
        loading: false,
        logged: true,
        user: {
          platformData: JSON.parse(data.profile.platformData),
          sources: JSON.parse(data.profile.sources)
        },
      });
    }).catch(error => {
      //console.error(error);
      console.error("Can not get user data.")
      this.setState({
        loading: false,
        logged: false,
        user: false,
      });
    })
  }

  fetchGitLabServers = async () => {
    await this.props.client.query({
      query: GET_GITLAB_SERVERS,
      variables: { 
        "token": localStorage.getItem('jwt_snek')
      }
    }).then(({data}) => {
      console.log(data);
      this.setState({
        gitlab_servers: data,
      });
    }).catch(error => {
      //console.error(error);
      console.error("Can not get gitlab severs.",error)
      this.setState({
        gitlab_servers: false
      });
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
            this.setState({
              logged: false,
              loading: false,
              user: false,
            }, () => {
              localStorage.setItem('jwt_snek', data.tokenAuth.token);
              localStorage.setItem("is_logged", false);
            });
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
            this._getData(username, data.tokenAuth.token);
            localStorage.setItem('jwt_snek', data.tokenAuth.token);
            localStorage.setItem("is_logged", true);
          }
        }
      }
    }).catch((loading, error) => {
      // Username or password is wrong
      console.error(error);
      this.setState({
        loading: false,
        logged: false,
        user: false,
      }, () => localStorage.setItem("is_logged", false));
    });
  }

  render() {
    console.log(this.state);

    return (
      <Router>
      {localStorage.getItem("is_logged") === true && <Redirect to="/me" />}
        <ScrollToTop>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes 
              logmein={this._login}
              fetchGitLabServers={this.fetchGitLabServers}
              globalState={this.state}
              />
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
