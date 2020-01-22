//> React
// Contains all the functionality necessary to define React components
import React from "react";
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from "react-dom";

//> Font Awesome
// Font Awesome is an awesome icon library
import '@fortawesome/fontawesome-free/css/all.min.css';

//> Bootstrap
import 'bootstrap-css-only/css/bootstrap.min.css';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import 'mdbreact/dist/css/mdb.css';

//> CSS
// Root SCSS file
import "./index.scss";

//> Components
// Root component
import App from "./App";

import registerServiceWorker from "./registerServiceWorker";

//> Connect to backend
// Apollo
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Base url
export const APIHost = 'https://engine.snek.at';

// Create api url from base url
const APILink = APIHost+"/api/graphiql";

const httpLink = createHttpLink({
  uri: APILink,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem("jwt_snek") ? `Bearer ${localStorage.getItem("jwt_snek")}` : null,
    }
  }
});

// Apollo Client setup
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Render the root component to <div id="root"></div>
ReactDOM.render( 
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

registerServiceWorker();

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
