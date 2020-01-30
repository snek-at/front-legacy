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

//> Intel
import * as intel from "./intel";

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
  query getProfile($url: String!, $token: String!) {
    profile: page(url: $url, token: $token) {
      ... on ProfileProfilePage {
        username
        verified
        platformData
        sources
      }
    }
  }
`;
// Get user login data
const GET_USER_LOGINDATA = gql`
  query getProfile($url: String!, $token: String!) {
    profile: page(url: $url, token: $token) {
      ... on ProfileProfilePage {
        username
        verified
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
// Update Cache
const UPDATE_CACHE = gql`
  mutation cache ($token: String!, $platformData: String!) {
    cacheUser(token: $token, platformData: $platformData){
      user{
        platformData
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
            this._getLoginData(data.verifyToken.payload.username, localStorage.getItem('jwt_snek'));
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

  getData = async (username) => {
    console.log(username);
    await this.props.client.query({
      query: GET_USER_DATA,
      variables: { 
        "url": "/registration/"+username,
        "token": localStorage.getItem('jwt_snek')
      }
    }).then(({data}) => {
      console.log(data);
      if(data.profile.verified){
        // Redirect and login
        let platformData = JSON.parse(data.profile.platformData);
        let sources = JSON.parse(data.profile.sources);
        let cache = {};
        this.setState({
          fetchedUser: {
            platformData: platformData,
            sources: sources,
            username: data.profile.username,
            verified: data.profile.verified,
          },
        });
        intel
        .fill(sources)
        .then(async () => {
          intel.calendar();
          intel.stats();
          intel.repos();
        })
        .then(async () => {
          this.setState({
            logged: true,
            contrib: intel.stats(),
            contribCalendar: intel.calendar(),
            contribTypes: intel.contribTypes(),
            user: intel.user(),
            orgs: intel.orgs(),
            languages: intel.languages(),
            repos: intel.repos(),
          });
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
          platformData = JSON.stringify(cache);
          this.props.caching({
            variables: { 
            token: localStorage.getItem("jwt_snek"),
            platformData
          }
          }); 
        });
      } else {
        this.setState({
          fetchedUser: false,
        });
      }
      /*this.setState({
        loading: false,
        logged: true,
      });*/
    }).catch(error => {
      //console.error(error);
      console.error("Can not get user data.")
      this.setState({
        fetchedUser: false,
      });
    })
  }

  _getLoginData = async (username, token) => {
    console.log(username);
    await this.props.client.query({
      query: GET_USER_LOGINDATA,
      variables: { 
        "url": "/registration/"+username,
        "token": token
      }
    }).then(({data}) => {
      console.log(data);
      if(data.profile.verified){
        // Fill data
        this.setState({
          loading: false,
          logged: true,
          user: username,
        });
        /*intel.fill(sources)
        .then(async () => {
          intel.calendar();
          intel.stats();
          intel.repos();
        })
        .then(async () => {
          this.setState({
            loading: false,
            logged: true,
            user: data.profile.username,
            contrib: intel.stats(),
            contribCalendar: intel.calendar(),
            contribTypes: intel.contribTypes(),
            user: intel.user(),
            orgs: intel.orgs(),
            languages: intel.languages(),
            repos: intel.repos(),
          });
          let cache = {
            loading: false,
            logged: true,
            user: data.profile.username,
            contrib: intel.stats(),
            contribCalendar: intel.calendar(),
            contribTypes: intel.contribTypes(),
            user: intel.user(),
            orgs: intel.orgs(),
            languages: intel.languages(),
            repos: intel.repos(),
          };
          let platformData = JSON.stringify(cache);
          this.props.caching({
            variables: { 
            token: localStorage.getItem("jwt_snek"),
            platformData
          }});
        });*/
        // Redirect
      } else {
        this.setState({
          loading: false,
          logged: false,
          user: false,
        });
      }
      /*this.setState({
        loading: false,
        logged: true,
      });*/
    }).catch(error => {
      //console.error(error);
      console.error("Can not get login data.", error)
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
        gitlab_servers: data.page.supportedGitlabs,
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
            this._getLoginData(username, data.tokenAuth.token);
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

  _logout = () => {
    this.setState({
      loading: false,
      logged: false,
      user: undefined,
    }, () => {
      if(localStorage.getItem("is_logged") && localStorage.getItem("jwt_snek")){
        localStorage.removeItem("is_logged");
        localStorage.removeItem("jwt_snek");
      }
      this._loginAnonymous();
    })
  }

  render() {
    console.log(this.state);

    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar 
            username={this.state.user}
            logmeout={this._logout}
            globalState={this.state}
            />
            <main>
              <Routes 
              logmein={this._login}
              fetchGitLabServers={this.fetchGitLabServers}
              fetchProfileData={this.getData}
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
  graphql(UPDATE_CACHE, { name: "caching" })
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
