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
  mutation signup($merchant: MerchantUserInput!) {
    signup(merchant: $merchant) {
      token
      error
    }
  }
`;

export const MERCHANT_EDIT_MODE = gql`
  mutation merchantEditMode($id: Int!) {
    merchantEditMode(id: $id) @client
  }
`;
