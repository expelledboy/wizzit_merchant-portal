import gql from "graphql-tag";

export const LIST_MERCHANT_USERS = gql`
  query {
    merchantUsers {
      id
      firstName
      lastName
      email
      active
    }
  }
`;

export const CURRENT_USER = gql`
  query {
    me {
      id
      email
      firstName
      lastName
      active
    }
  }
`;

export const MERCHANT_USER = gql`
  query merchantUser($id: ID!) {
    user(where: { id: $id }) {
      id
      firstName
      lastName
      email
      merchant
      editing @client
    }
  }
`;