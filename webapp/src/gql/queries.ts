import { gql } from "apollo-boost";

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY($skip: Int = 0, $first: Int = 100) {
    users(first: $first, skip: $skip, orderBy: "statOrderNo_ASC") {
      id
      firstName
      lastName
      email
    }
  }
`;

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      firstName
      lastName
    }
  }
`;

const SINGLE_USER_QUERY = gql`
  query SINGLE_USER_QUERY($id: ID!) {
    user(where: { id: $id }) {
      id
      title
      description
    }
  }
`;

const USER_QUERY = gql`
  query USER_QUERY($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

const USER_PAGINATION_QUERY = gql`
  query USER_PAGINATION_QUERY {
    usersConnection {
      aggregate {
        count
      }
    }
  }
`;

export {
  ALL_USERS_QUERY,
  CURRENT_USER_QUERY,
  SINGLE_USER_QUERY,
  USER_QUERY,
  USER_PAGINATION_QUERY
};
