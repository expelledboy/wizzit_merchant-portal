import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { default as WatchedMutationLink } from "apollo-link-watched-mutation";
import { LOCALSTORAGE_TOKEN } from "./../constants";
import { updates } from "./updates";
import { resolvers } from "./resolvers";
import introspectionQueryResultData from "./fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export const cache = new InMemoryCache({ fragmentMatcher });

export const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

  if (token) {
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  }

  return forward(operation);
});

export const watchedMutationLink = new WatchedMutationLink(cache, updates);

cache.writeData({
  data: {
    edittingMerchantUser: null
  }
});

export const httpLink = new HttpLink({ uri: "/graphql" });

export const link = ApolloLink.from([
  authLink,
  errorLink,
  watchedMutationLink,
  httpLink
]);

export const gqlClient = new ApolloClient({
  link,
  cache,
  resolvers: resolvers as any
});
