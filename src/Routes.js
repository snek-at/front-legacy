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
} from './components/pages';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route
        exact
        path='/' 
        component={
          (props) => <HomePage 
          logmein={this.props.logmein} 
          globalState={this.props.globalState} 
          fetchGitLabServers={this.props.fetchGitLabServers}
          {...props}
          />
        }
        />
        <Route 
        exact
        path='/u/:username'
        component={
          (props) => <ProfilePage
          globalState={this.props.globalState}
          fetchProfileData={this.props.fetchProfileData}
          {...props}
          />
        } />
        <Route 
        exact
        path='/donate/cancel'
        component={(props) => <MessagePage {...props}/>}
        />
        <Route
        exact
        path='/donate/thankyou'
        component={(props) => <MessagePage {...props} />}
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
