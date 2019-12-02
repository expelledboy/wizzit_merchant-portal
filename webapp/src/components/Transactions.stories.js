import React from "react";
import casual from "casual-browserify";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import { Transactions } from "./Transactions";

const transactions = [...Array(31)].map(() => ({
  id: casual.uuid,
  amount: casual.integer(0, 1000)
}));

const mocks = {
  Query: () => ({
    transactions(_root, args) {
      console.log("transactions", args);
      const { cursor, limit } = args;

      const idx = cursor
        ? transactions.findIndex(item => item.id === cursor)
        : 0;

      if (transactions[idx] >= 0) throw new Error("invalid cursor");

      const items = transactions.slice(idx, idx + limit);
      const next = transactions[idx + limit];

      return {
        cursor: next && next.id,
        haveMore: !!next,
        items
      };
    }
  })
};

storiesOf("Transactions", module)
  .addDecorator(
    createApolloProvider({
      mocks
    })
  )
  .add("Table", () => {
    const props = {};
    return <Transactions {...props} />;
  });
