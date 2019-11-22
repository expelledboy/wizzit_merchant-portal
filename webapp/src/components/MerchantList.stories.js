import React from "react";
import casual from "casual-browserify";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { MerchantList } from "./MerchantList";

const merchants = [...Array(10)].map(() => ({
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
    merchants() {
      return merchants;
    }
  }),
  Mutation: () => ({
    deleteMerchant(root, { merchantId }) {
      console.log("here");
      return true;
    },
    saveMerchant(root, { merchant }) {
      console.log("here");
      return merchant.id;
    }
  })
};

storiesOf("MerchantList", module)
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
  .add("List of merchants", () => {
    const props = {};
    return <MerchantList {...props} />;
  });
