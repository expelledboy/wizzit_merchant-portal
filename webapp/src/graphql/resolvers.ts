import { IResolvers } from "graphql-tools";
import gql from "graphql-tag";

const merchantUserEditting = gql`
  fragment edittingMerchant on MerchantUser {
    editting
  }
`;

const merchantEditting = gql`
  fragment edittingMerchant on Merchant {
    editting
  }
`;

export const resolvers: IResolvers = {
  MerchantUser: {
    editting: () => {
      return false;
    }
  },
  Merchant: {
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
    },
    merchantsEditMode: (parent, args, { cache, getCacheKey }) => {
      const merchantId = getCacheKey({ __typename: "Merchant", merchantId: args.merchantId });
      const merchant = cache.readFragment({
        fragment: merchantEditting,
        merchantId
      });
      const data = { ...merchant, editting: !merchant.editting };
      cache.writeData({ merchantId, data });
      return null;
    }
  }
};
