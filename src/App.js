//> React
// Contains all the functionality necessary to define React components
import React from "react";

import { toast, ToastContainer} from 'mdbreact';
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
        bids
        tids
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
`;// Get GitLab servers
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
// Register mutation
const CREATE_USER_MUTATION = gql`
  mutation register($token: String!, $values: GenericScalar!) {
    registrationRegistrationFormPage(token: $token, url: "/registration", values: $values) {
      result
      errors {
        name
        errors
      }
    }
  }
`;
// Update Cache
const UPDATE_CACHE = gql`
  mutation cache ($token: String!, $platformData: String!) {
    cacheUser(token: $token, platformData: $platformData){
      user{
        id
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
    console.log("Loading app");
    // Check if there is a token
    if(localStorage.getItem('jwt_snek')){
      this._verifyToken();
    } else {
      console.log("No token, login anonymous");
      this._loginAnonymous();
    }
  }

  _verifyToken = async () => {
    console.log("Verifying token");
    await this.props.verify({
      variables: { "token": localStorage.getItem('jwt_snek') }
    }).then(({data}) => {
      console.log("Verify data",data);
      if(data){
        if(data.verifyToken){
          this.fetchGitLabServers(localStorage.getItem('jwt_snek'));
          console.log("Verified");
          let username = data.verifyToken.payload.username;
          // Check if it's not the anonymous user
          if(username !== process.env.REACT_APP_ANONYMOUS_USER){
            console.log("Get login data from verifyToken");
            this._getLoginData(data.verifyToken.payload.username, localStorage.getItem('jwt_snek'));
          } else {
            console.log("Is anonymous user");
            this.setState({
              loading: false,
              logged: false,
              user: undefined,
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
      variables: {
        "token": localStorage.getItem('jwt_snek')
      }
    }).then(({data}) => {
      console.log(data);
      console.log("Refresh token success.");
      if(data !== undefined){
        this.fetchGitLabServers(data.refreshToken.token);
        localStorage.setItem('jwt_snek', data.refreshToken.token);
      }
    }).catch(error => {
      console.error("Could not get refresh token",error);
      // Login anonymous user - Member is signed out
      this.setState({
        logged: false,
        user: undefined,
      }, () => this._loginAnonymous());
    })
  }

  getData = async (username) => {
    await this._verifyToken();
    await this.props.client.query({
      query: GET_USER_DATA,
      variables: { 
        "url": "/registration/"+username,
        "token": localStorage.getItem('jwt_snek')
      }
    }).then(({data}) => {
      console.log("Get user data from "+username,data);
      if(data.profile.verified){
        // Redirect and login
        let platformData = JSON.parse(data.profile.platformData);
        let sources = JSON.parse(data.profile.sources);
        let cache = {};
        /**
         * ################
         * DUMMY DATA
         * Remove and replace with live data when ready
         * ################
         */
        // Change this to change from software to media
        let enableMediaEngineer = false;
        if(enableMediaEngineer){
          platformData.user.type = "media";
        } else {
          platformData.user.type = "software";
        }

        if(!platformData.user.settings){
          // Settings
          platformData.user.settings = {
            showMap: true,
            showInstagramFeed: true,
            instagramHideCaption: true,
            show3DDiagram: true,
            show2DDiagram: true,
            showCompanyPublic: true,
            showEmailPublic: true,
            showLocalRanking: true,
          }
        }
        console.log(platformData.user.type);
        // If no type has been set, perform user data injection
        if(!platformData.user.type){
          // Injecting platformData
          if(enableMediaEngineer){
            // Set type to media to distinguish
            platformData.user.type = "media";
            // Set media engineer platforms
            platformData.user.platforms = {
              instagram: {
                url: "https://www.instagram.com/aichnerchristian/"
              },
              facebook: {
                url: "https://www.facebook.com/aichner.christian"
              },
              portfolio: {
                url: "https://www.aichner-christia.com/portfolio"
              }
            }
            // Portfolio map
            platformData.user.mapData = [
              { name: "1", coordinates: [12.8506, 44.6086] },
              { name: "2", coordinates: [13.8496928, 46.6114363 ] },
              { name: "3", coordinates: [11.489387, 48.783450 ] }
            ]
            // Skills (like languages for programmers)
            platformData.user.skills = [
              {name: "Photography", color: "#563d7c", size: 54, share: 10},
              {name: "Video", color: "#263d1c", size: 54, share: 20},
              {name: "Web", color: "#763d2c", size: 54, share: 70},
            ]
            // Instagram posts
            platformData.user.instagram = [
              {url: "https://www.instagram.com/p/B9cOSWMJbXD/"},
              {url: "https://www.instagram.com/p/B9TWGNaglUz/"}
            ]
          } else {
            // Add needed variables software engineer
            platformData.user.type = "software";
          }
          console.log(platformData);
          // Add needed variables for both software- and media engineer
          platformData.user.first_name = "Max";
          platformData.user.last_name = "Mustermann";
          console.log("PD",platformData);
        }
        /**
         * ################
         * DUMMY DATA END
         * ################
         */
        this.setState({
          fetchedUser: {
            platformData: platformData,
            sources: sources,
            username: data.profile.username,
            verified: data.profile.verified,
            accessories: {
              badges: data.profile.bids ? JSON.parse(data.profile.bids) : null,
              themes: data.profile.tids ? JSON.parse(data.profile.tids) : null
            }
          },
        });
        /*intel
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
        });*/
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

  saveSettings = (state) => {
    console.log("State",state);
    console.log(this.state);
    /**
     * Use caching to save new, edited data.
     * This has to be updated whenever parameters are added or removed.
     */
    // Fill platformData to be used and edited locally
    let cache = this.state.fetchedUser.platformData;
    // Check for mandatory fields
    if(state.email){
      cache.user.first_name = state.first_name ? state.first_name : "";
      cache.user.last_name = state.last_name ? state.last_name : "";
      cache.user.email = state.email ? state.email : cache.user.email;
      cache.user.websiteUrl = state.website ? state.website : "";
      cache.user.location = state.location ? state.location : "";
      cache.user.company = state.company ? state.company : "";
      cache.user.settings = {
        showTopLanguages: state.showTopLanguages,
        showLocalRanking: state.showLocalRanking,
        show3DDiagram: state.show3DDiagram,
        show2DDiagram: state.show2DDiagram,
        showEmailPublic: state.showEmailPublic,
        showCompanyPublic: state.showCompanyPublic,
        showMap: state.showMap,
        showInstagramFeed: state.showInstagramFeed,
        instagramHideCaption: state.instagramHideCaption,
      }
    }
    console.log(cache);
    let platformData = JSON.stringify(cache);
      this.props.caching({
          variables: { 
          token: localStorage.getItem("jwt_snek"),
          platformData
        }
      })
      .then(({data}) => {
        console.log(data);
        this.setState({
          fetchedUser: {
            ...this.state.fetchedUser,
            platformData: JSON.parse(platformData)
          }
        });
      })
  }

  _getLoginData = async (username, token) => {
    console.log("Getting login data for user "+username);
    await this.props.client.query({
      query: GET_USER_LOGINDATA,
      variables: { 
        "url": "/registration/"+username,
        "token": token
      }
    }).then(({data}) => {
      console.log("Got login data from "+username,data);
      if(data.profile.verified){
        // Fill data
        this.setState({
          loading: false,
          logged: true,
          user: username,
        });
        // Redirect
      } else {
        console.log("User not verified");
        this.setState({
          loading: false,
          logged: false,
          user: false,
        });
      }
    }).catch(error => {
      //console.error(error);
      console.error("Can not get login data", error)
      this.setState({
        loading: false,
        logged: false,
        user: false,
      });
    })
  }

  fetchGitLabServers = async (token) => {
    await this.props.client.query({
      query: GET_GITLAB_SERVERS,
      variables: { 
        "token": localStorage.getItem('jwt_snek')
      }
    }).then(({data}) => {
      console.log(data);
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
    console.log("Perform anonymous login");
    await this.props.login({ 
      variables: { 
        "username": process.env.REACT_APP_ANONYMOUS_USER,
        "password": process.env.REACT_APP_ANONYMOUS_PASS
      }
    }).then(({ loading, data }) => {
      console.log("Anonymous login success");
      if(data){
        if(data.tokenAuth){
          if(data.tokenAuth.token){
            this.setState({
              logged: false,
              loading: false,
              user: undefined,
            }, () => {
              localStorage.setItem('jwt_snek', data.tokenAuth.token);
              localStorage.setItem("is_logged", false);
              this.fetchGitLabServers(data.tokenAuth.token);
            });
          }
        }
      }
    }).catch((error) => {
      console.log("Anonymous login failed",error);
    });
  }

  _login = async (username, password) => {
    console.log("Perform login with "+username);

    await this.props.login({ 
      variables: { 
        "username": username,
        "password": password
      }
    }).then(({ loading, data }) => {
      console.log("Login successful with "+username,data);
      if(data){
        if(data.tokenAuth){
          if(data.tokenAuth.token){
            this._getLoginData(username, data.tokenAuth.token);
            localStorage.setItem('jwt_snek', data.tokenAuth.token);
            localStorage.setItem("is_logged", true);
          }
        }
      }
    }).catch((error) => {
      // Username or password is wrong
      console.log("Login failed with "+username);
      toast.error(error.message.split(":")[1], {
        closeButton: false,
      });
      this.setState({
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

  _registerUser = (values) => {
    this.props.register({
        variables: { 
        token: localStorage.getItem("jwt_snek"),
        values
      }
      })
      .then((result) => {
        console.log(result);
        if (result.message === "FAIL"){
          console.log("warn","All fields have to be filled!");
        } else {
          this._login(values.username, values.password)
        }
      })
      .catch((error) => {
        console.log(error);
          if (error.message.includes("Authentication required"))
          {
            console.log("success"," Welcome to SNEK!");
          }
          else if (error.message.includes("Duplicate entry"))
          {
            console.log("warn"," Username already taken!");
          }
          else
          {
            console.error("error", error);
          }
      });
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar 
            username={this.state.user}
            logmeout={this._logout}
            globalState={this.state}
            />
            <ToastContainer
              hideProgressBar={false}
              newestOnTop={true}
              autoClose={3000}
            />
            <main>
              <Routes 
              logmein={this._login}
              fetchProfileData={this.getData}
              globalState={this.state}
              registerUser={this._registerUser}
              saveSettings={this.saveSettings}
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
  graphql(VERIFY_TOKEN, { name: "verify" }),
  graphql(REFRESH_TOKEN, { name: "refresh" }),
  graphql(LOGIN_USER, { name: "login" }),
  graphql(CREATE_USER_MUTATION, { name: "register" }),
  graphql(UPDATE_CACHE, { name: "caching" })
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
