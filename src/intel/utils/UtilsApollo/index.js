// Apollo
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";

let LINK;
let cache;

export const init = (apiLink, authorization) => {
  // Cache setup
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [] // no types provided - works like a charm.ing
      }
    }
  });
  cache = new InMemoryCache({ fragmentMatcher });

  // Created HttpLink
  LINK = new HttpLink({
    uri: apiLink,
    headers: {
      authorization: authorization
    }
  });
  // Apollo client setup
  const client = new ApolloClient({
    cache,
    link: LINK
  });
  return client;
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
