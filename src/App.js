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
  Footer,
} from "./components/molecules";

//> Routes
import Routes from "./Routes";

//> Intel
import * as intel from "./intel";

//> Apollo
import { graphql, withApollo } from "react-apollo";
import * as compose from "lodash.flowright";
import { gql } from "apollo-boost";

//> Queries / Mutations
// Verify the token
const VERIFY_TOKEN = gql`
  mutation verify($token: String!) {
      verifyToken(token: $token) {
      payload
      }
  }
`;
// Login real user
const LOGIN_REAL_USER = gql`
  query login($token: String!){
  user: me(token: $token){
      username
      registrationData
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
  // Initialize state
  state = {
    contrib: null,
    contribCalendar: null,
    contribTypes: null,
    user: null,
    languages: null,
    repos: null,
    token: "",
    loaded: false,
    logged: false,
  };

  componentDidMount = () => {
    // Clear state on reload
    this.setState({
      contrib: null,
      contribCalendar: null,
      contribTypes: null,
      user: null,
      languages: null,
      repos: null,
      pageLogin: false,
    });

    if(localStorage.getItem("jwt_snek") !== null){
      try {
        // Verify JWT Token on first load
        this._verifyToken();
        // Refresh JWT token every 4 minutes
        setInterval(async () => {
          this._refreshToken();
        }, 120000);
      } catch(e) {
        //console.log(2, e);
      }
    } else {
      this._loginUser();
    }
  };

  _verifyToken = () => {
    this.props.verify({
      variables: { "token": localStorage.getItem("jwt_snek") }
    })
    .then(({data}) => {
        if(data !== undefined){
          if(data.verifyToken !== null){
            this._isLogged(
              data.verifyToken.payload.exp,
              data.verifyToken.payload.origIat,
              localStorage.getItem("jwt_snek")
            );
          } else {
            //> Troubleshooting Point 2
            // Missing token payload @ Token verification with snek server (App.js)
            //console.warn(TSID2, "No token in payload.");
          }
        } else {
          //> Troubleshooting Point 2
          // Missing token payload @ Token verification with snek server (App.js)
          //console.warn(TSID2, "No token in payload.");
        }
    })
    .catch((error) => {
      //> Troubleshooting Point 3
      // GraphQL mutation error @ Verify snek JWT (App.js)
      //console.warn(TSID3, "Mutation error:",error);
    });
  }

  // Reuqest JWT from engine.snek.at/api/graphiql
  _loginUser = () => {
    this.props.login()
    .then(({data}) => {
      if(data !== undefined){
        // Set JWT, received from engine.snek.at/api/graphiql
        this._setLogged(data.tokenAuth.token);
      }
    })
    .catch((error) => {
      //> Troubleshooting Point 4
      // GraphQL mutation error @ Login snek JWT (App.js)
      //console.error(TSID4, "Mutation error:",error);
    });
  }

  // Set JWT, received from engine.snek.at/api/graphiql
  _setLogged = (token) => {
    this.setState({
      token,
      loaded: true,
    }, () => localStorage.setItem("jwt_snek", token));
    this.handleLogin();
  }

  // Login with JWT, received from engine.snek.at/api/graphiql
  _isLogged = (exp, orig, token) => {
    /**
     * Generate current timestamp
     * Ref: https://flaviocopes.com/how-to-get-timestamp-javascript/
     */
    let currentTS = ~~(Date.now() / 1000);
    // Check if the JWT token is still valid
    if(currentTS > exp){
      // JWT has expired
      this._refeshToken(token);
    } else {
      // Only if anything has changed, update the data
      this._setLogged(token);
    }
  }

  // Refresh JWT, received from engine.snek.at/api/graphiql
  _refreshToken = () => {
    this.props.refresh({
      variables: { "token": localStorage.getItem("jwt_token") }
    })
    .then(({data}) => {
      if(data !== undefined){
        localStorage.setItem("jwt_snek", data.refreshToken.token);
      }
    })
    .catch((error) => {
      //> Troubleshooting Point 5
      // GraphQL mutation error @ Refreshing snek JWT every 2min (App.js)
      //console.warn(TSID5, "Mutation error:",error);
    });
  }

  handleChangeState = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  // Handle login with JWT token
  handleLogin = (token) => {
    this.props.client.query({
      query: LOGIN_REAL_USER,
      variables: { "token": localStorage.getItem("jwt_snek") }
    }).then(({data}) => {
      if(data){
        let registrationData = JSON.parse(data.user.registrationData);
        let plattformDataTemp = registrationData.platform_data.replace(/'/g,'"');
        let platformData = JSON.parse(plattformDataTemp);
        intel
        .fill(Object.values(platformData))
        .then(() => {
          intel.calendar();
          intel.stats();
          intel.repos();
        })
        .then(() => {
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
        });
      }
    })
    .catch((error) => {
      //> Troubleshooting Point 6
      // Database error message @ Saving generated user data (App.js)
      //console.warn("TSID6", error.message);
    });
  }

  render() {
    return (
      <Router>
        <div className="flyout">
          <Navbar 
          changeState={this.handleChangeState}
          data={this.state}
          />
          <main>
            <Routes 
            data={this.state}
            changeState={this.handleChangeState}
            login={this.handleLogin}
            />
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

// Graphql-Server is engine.snek.at/api/graphiql
export default compose(
  graphql(VERIFY_TOKEN, { name: "verify" }),
  graphql(REFRESH_TOKEN, { name: "refresh" }),
  graphql(LOGIN_USER, { name: "login" }),
)(withApollo(App));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
