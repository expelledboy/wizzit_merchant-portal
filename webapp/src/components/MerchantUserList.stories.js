import React from "react";
import casual from "casual-browserify";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { MerchantUserList } from "./MerchantUserList";

const merchantUsers = [...Array(10)].map(() => ({
  id: casual.integer(1000, 2000),
  firstName: casual.first_name,
  lastName: casual.last_name,
  role: casual.random_element(["Admin", "MerchantUser"]),
  email: casual.email,
  active: casual.boolean,
  editting: casual.boolean
}));

const mocks = {
  Query: () => ({
    merchantUsers() {
      return merchantUsers;
    }
  })
};

storiesOf("MerchantUserList", module)
  .addDecorator(
    createApolloProvider({
      mocks
    })
  )
  .add("List of merchants", () => {
    const props = {};
    return <MerchantUserList {...props} />;
  });
