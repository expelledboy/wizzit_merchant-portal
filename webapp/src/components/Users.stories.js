import React from "react";
import casual from "casual-browserify";
import { MockedProvider } from "@apollo/react-testing";
import { MemoryRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { Users } from "./Users";
import { generateUnique } from "../@utils/faker.js";

let merchants = generateUnique(
  10,
  () => ({
    id: casual.integer(100, 200),
    name: casual.company_name
  }),
  by => by.id
);

casual.define("merchantId", function() {
  const merchantId = casual.random_element(
    merchants.map(merchant => merchant.id)
  );
  return casual.random_element([null, merchantId]);
});

let users = generateUnique(
  3,
  () => ({
    id: casual.integer(100, 200),
    email: casual.email,
    password: "hashedPassword",
    firstName: casual.first_name,
    lastName: casual.last_name,
    role: casual.random_element(["Admin", "MerchantUser"]),
    merchantId: casual.merchantId,
    active: casual.boolean
  }),
  by => by.id
);

const mocks = {
  User: () => ({
    merchant(user) {
      return merchants.find(item => item.id === user.merchantId);
    }
  }),
  Query: () => ({
    users(_root, { page, pageSize }) {
      let start = page * pageSize - pageSize;
      let end = page * pageSize;
      return {
        total: users.length,
        items: users.slice(start, end)
      };
    },
    merchants(_root, { page, pageSize }) {
      let start = page * pageSize - pageSize;
      let end = page * pageSize;
      return {
        total: merchants.length,
        items: merchants.slice(start, end)
      };
    }
  }),
  Mutation: () => ({
    updateUser(_root, { id, user }) {
      const idx = users.findIndex(item => item.id === parseInt(id));
      if (idx < 0) throw new Error("user not found");
      Object.assign(users[idx], user);
      return true;
    }
  })
};

storiesOf("Users", module)
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
    return <Users {...props} />;
  });
