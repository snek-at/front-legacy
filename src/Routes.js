//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { Route, Switch } from "react-router-dom";

//> Components
import { 
  SettingsPage,
  ProfilePage,
  LandingPage,
  RedirectPage,
  GitLabPage,
} from "./components/pages";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          component={(props) => (
            <LandingPage 
            globalStore={this.props}
            login={this.props.login}
            {...props}
            />
          )}
        />
        <Route exact path="/settings" component={SettingsPage} />
        <Route
          exact
          path="/me"
          component={(props) => (
            <ProfilePage 
            globalStore={this.props} {...props}
            />
          )}
        />
        <Route exact path="/redirect" component={RedirectPage} />
        <Route exact path="/gitlab" component={GitLabPage} />
        <Route 
        exact
        path="/about"
        component={() => window.location = "https://www.aichner-christian.com/about"}
        />
        <Route
          render={function() {
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
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
