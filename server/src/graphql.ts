import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { applyMiddleware } from "graphql-middleware";
import { permissions, getTokenPayload } from "./permissions";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { playground } from "./playground";
import { default as Knex } from "knex";
import * as knexfile from "../knexfile";

const env = process.env.NODE_ENV || "development";
const db = Knex(knexfile[env]);

export const api = express();

const context = ({ req }: { req: Request }) => {
  let payload = {};

  try {
    const token = req.headers["authorization"];
    if (token) payload = getTokenPayload(token.replace("Bearer ", ""));
  } catch {
    console.warn("Authentication failed");
  }

  return {
    ...req,
    ...payload,
    db
  };
};

const formatError = error => {
  console.error(JSON.stringify(error, null, 2));
  return error;
};

const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions
);

const apolloServer = new ApolloServer({
  schema,
  formatError,
  context,
  introspection: true,
  playground
});

apolloServer.applyMiddleware({ app: api, path: "/" });
