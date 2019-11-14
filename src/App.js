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
} from './components/molecules';

//> Routes
import Routes from "./Routes";

//> Test
// A test with the user "torvalds"
import "./App.test";

class App extends React.Component {

  // Init state
  state = {
    contrib: null,
    contribCalendar: null,
    contribTypes: null,
    user: null,
    languages: null,
    repos: null
  };

  componentDidMount = () => {
    // Fill with data
    this.setState({
      contrib: null,
      contribCalendar: null,
      contribTypes: null,
      user: null,
      languages: null,
      repos: null,
    });
  }

  render() {
    // Debugging
    console.log(this.state);
    
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

export default App;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
