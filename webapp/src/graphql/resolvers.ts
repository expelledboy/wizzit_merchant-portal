// import gql from "graphql-tag";

export const resolvers = {
  Mutation: {
    // merchantEditMode: (parent, variables, { cache, getCacheKey }) => {
    //   const edittingMerchant = gql`
    //     fragment edittingMerchant on Merchant {
    //       editting
    //     }
    //   `;
    //   const id = getCacheKey({ __typename: "merchant", id: variables.id });
    //   const merchant = cache.readFragment({ fragment: edittingMerchant, id });
    //   const data = { ...merchant, editting: !merchant.editting };
    //   cache.writeData({ id, data });
    //   return null;
    // }
  }
};
