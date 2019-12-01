import React from "react";
import casual from "casual-browserify";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { Merchants } from "./Merchants";

let merchants = [...Array(7)].map(() => ({
  id: casual.integer(100, 200),
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
    merchants(_root, args) {
      return {
        total: merchants.length,
        items: merchants
      };
    }
  }),
  Mutation: () => ({
    deleteMerchant(_root, { id }) {
      merchants = merchants.filter(merchant => merchant.id !== parseInt(id));
      return true;
    },
    createMerchant(_root, { id, merchant }) {
      const idx = merchants.findIndex(item => item.id === parseInt(id));
      if (idx >= 0) throw new Error("merchant already exists");
      Object.assign(merchant, {
        merchantId: casual.uuid,
        active: false,
        ...merchant
      });
      merchants.push(merchant);
    },
    updateMerchant(_root, { id, merchant }) {
      const idx = merchants.findIndex(item => item.id === parseInt(id));
      if (idx < 0) throw new Error("merchant not found");
      Object.assign(merchants[idx], merchant);
      return true;
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
