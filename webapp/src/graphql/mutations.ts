import gql from "graphql-tag";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      error
    }
  }
`;

export const SIGNUP = gql`
  mutation signup($merchant: RegisterMerchantUserInput!) {
    signup(merchant: $merchant) {
      token
      error
    }
  }
`;

export const EDIT_MERCHANT_USER = gql`
  mutation merchantEditMode($id: ID!) {
    merchantEditMode(id: $id) @client
  }
`;

export const DELETE_MERCHANT_USER = gql`
  mutation deleteMerchantUser($id: ID!) {
    deleteMerchantUser(id: $id)
  }
`;

export const SAVE_MERCHANT_USER = gql`
  mutation saveMerchantUser($merchantUser: MerchantUserInput!) {
    saveMerchantUser(merchantUser: $merchantUser)
  }
`;
