//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { Route, Switch } from "react-router-dom";

//> Components
import {
  HomePage,
  ProfilePage,
  MessagePage,
  RedirectPage,
  SearchPage,
  CompanyPage,
} from "./components/pages";

class Routes extends React.Component {
  saveSettings = (state) => {
    this.props.saveSettings(state);
  };

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          component={(props) => (
            <HomePage
              logmein={this.props.logmein}
              globalState={this.props.globalState}
              registerUser={this.props.registerUser}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/redirect"
          component={(props) => <RedirectPage {...props} />}
        />
        <Route
          exact
          path="/u/:username"
          component={(props) => (
            <ProfilePage
              globalState={this.props.globalState}
              fetchCacheData={this.props.fetchCacheData}
              saveSettings={this.saveSettings}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/c/:company"
          component={(props) => (
            <CompanyPage globalState={this.props.globalState} {...props} />
          )}
        />
        <Route
          exact
          path="/donate/cancel"
          component={(props) => <MessagePage {...props} />}
        />
        <Route
          exact
          path="/donate/thankyou"
          component={(props) => <MessagePage {...props} />}
        />
        <Route
          exact
          path="/search"
          component={(props) => (
            <SearchPage globalState={this.props.globalState} {...props} />
          )}
        />
        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
