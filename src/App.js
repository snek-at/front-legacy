//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Components
import {
  Navbar,
  Footer,
} from "./components/organisms";
import {
  ScrollToTop,
} from './components/atoms';

//> Routes
import Routes from "./Routes";

class App extends React.Component {
  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes />
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
