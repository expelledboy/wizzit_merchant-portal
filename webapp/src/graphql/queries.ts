import gql from "graphql-tag";

export const LIST_MERCHANT_USERS = gql`
  query merchantUsers {
    merchantUsers {
      id
      firstName
      lastName
      email
      active
      editting @client
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
    }
  }
`;
