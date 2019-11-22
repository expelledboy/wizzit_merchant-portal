import React from "react";
import casual from "casual-browserify";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { Merchants } from "./Merchants";

const merchants = [...Array(25)].map(() => ({
  merchantId: casual.uuid,
  name: casual.company_name,
  merchantCode: casual.numerify("#####"),
  password: "12345",
  terminalId: casual.numerify("0##"),
  address: casual.address,
  active: casual.boolean
}));

const mocks = {
  Query: () => ({
    merchants(_root, { page, pageSize }) {
      let start = page * pageSize - pageSize;
      let end = page * pageSize;
      return {
        total: merchants.length,
        items: merchants.slice(start, end)
      };
    }
  })
};

storiesOf("Merchants", module)
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
    return <Merchants {...props} />;
  });
