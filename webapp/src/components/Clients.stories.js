import React from "react";
import casual from "casual-browserify";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { Clients } from "./Clients";

const clients = [...Array(12)].map(() => ({
  clientId: casual.uuid,
  msisdn: casual.numerify("27#########"),
  active: casual.boolean
}));

const mocks = {
  Query: () => ({
    clients(_root, args) {
      console.log("clients", args);
      const { page, pageSize } = args;

      let start = (page + 1) * pageSize - pageSize;
      let end = (page + 1) * pageSize;

      return {
        total: clients.length,
        items: clients.slice(start, end)
      };
    }
  }),
  Mutation: () => ({
    updateClient(_root, { clientId, client }) {
      const idx = clients.findIndex(item => item.clientId === clientId);
      if (idx < 0) throw new Error("client not found");
      Object.assign(clients[idx], client);
      return true;
    }
  })
};

storiesOf("Clients", module)
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
  .add("Table", () => {
    const props = {};
    return <Clients {...props} />;
  });
