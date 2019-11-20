import React from "react";
import casual from "casual-browserify";
import { IMocks } from "graphql-tools";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { ClientList } from "./ClientList";

const users = [...Array(10)].map(() => ({
  userId: casual.uuid,
  active: casual.boolean,
  msisdn: casual.numerify("27#########")
}));

const mocks: IMocks = {
  Query: () => ({
    users() {
      return users;
    }
  })
};

storiesOf("ClientList", module)
  .addDecorator(
    createApolloProvider({
      mocks
    })
  )
  .addDecorator(story => (
    <MockedProvider>
      <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
    </MockedProvider>
  ))
  .add("List of clients", () => {
    const props = {};
    return <ClientList {...props} />;
  });
