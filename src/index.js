//> React
// Contains all the functionality necessary to define React components
import React from "react";
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from "react-dom";

//> Font Awesome
// Font Awesome is an awesome icon library
import "@fortawesome/fontawesome-free/css/all.min.css";

//> Bootstrap
import "bootstrap-css-only/css/bootstrap.min.css";

//> Typist css
import "react-typist/dist/Typist.css";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import "mdbreact/dist/css/mdb.css";

//> CSS
// Root SCSS file
import "./index.scss";

//> Apollo
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

//> Components
// Root component
import App from "./App";

import registerServiceWorker from "./registerServiceWorker";

// API Link
const httpLink = createHttpLink({
  uri: "https://api.snek.at"
});

// Apollo Client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

// Render the root component to <div id="root"></div>
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
