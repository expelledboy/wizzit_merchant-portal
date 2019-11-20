import React, { Fragment } from "react";
import ApolloClient from "apollo-client";
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { resolvers } from "../graphql/resolvers";
import { cache, watchedMutationLink } from "../graphql/client";
import { loader } from "graphql.macro";

const typeDefs = loader("../../../server/src/schema.graphql");

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function createLink(schema: any, rootValue = {}, context = {}) {
  return new ApolloLink(operation => {
    return new Observable(observer => {
      const { query, operationName, variables } = operation;
      delay(300)
        .then(() => {
          return graphql(
            schema,
            print(query),
            rootValue,
            context,
            variables,
            operationName
          );
        })
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

export function createMockClient({ mocks }: any) {
  const schema = makeExecutableSchema({ typeDefs });

  addMockFunctionsToSchema({
    schema,
    mocks,
    preserveResolvers: true
  });

  return new ApolloClient({
    cache,
    resolvers: resolvers as any,
    link: ApolloLink.from([watchedMutationLink, createLink(schema)]),
    connectToDevTools: true
  });
}

export function createApolloProvider({ mocks }: any) {
  const graphqlClient = createMockClient({ mocks });

  function StorybookProvider({ children }: any) {
    return (
      <ApolloProvider client={graphqlClient}>
        <Fragment>{children}</Fragment>
      </ApolloProvider>
    );
  }

  return (story: any) => {
    return <StorybookProvider>{story()}</StorybookProvider>;
  };
}
