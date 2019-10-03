//> Connect to backend
// Apollo
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-cache-inmemory";

// GQL
import * as gqlData from "./GQL"

// Base url
export const APIHost = 'https://api.github.com';

// Cache setup
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [], // no types provided - works like a charm.ing
    },
  },
});
const cache = new InMemoryCache({ fragmentMatcher });

// Create api url from base url
const APILink = APIHost+"/graphql";
//const APILink = APIHost;


console.log(process.env);
console.log(process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN);
const LINK:HttpLink = new HttpLink({
  uri: APILink,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});

// Apollo Client setup
export const client = new ApolloClient({
  cache,
  link: LINK,
});

export const GET_PROFILE = gqlData.GET_PROFILE;
//export const GET_CALENDAR = gqlData.GET_CALENDAR;