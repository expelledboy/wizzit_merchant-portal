import { IResolvers } from "graphql-tools";
import gql from "graphql-tag";

const merchantUserEditting = gql`
  fragment edittingMerchant on MerchantUser {
    editting
  }
`;

export const resolvers: IResolvers = {
  MerchantUser: {
    editting: () => {
      return false;
    }
  },
  Mutation: {
    merchantEditMode: (parent, args, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: "MerchantUser", id: args.id });
      const merchantUser = cache.readFragment({
        fragment: merchantUserEditting,
        id
      });
      const data = { ...merchantUser, editting: !merchantUser.editting };
      cache.writeData({ id, data });
      return null;
    }
  }
};
