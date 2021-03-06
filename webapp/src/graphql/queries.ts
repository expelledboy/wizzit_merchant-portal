import gql from "graphql-tag";

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

export const LIST_MERCHANTS = gql`
  query merchants {
    merchants {
      merchantId
      name
      merchantCode
      terminalId
      address
      active
      editting @client
    }
  }
`;

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

export const MERCHANT = gql`
  query merchant($merchantId: ID!) {
    user(where: { merchantId: $merchantId }) {
      merchantId
      name
      merchantCode
      terminalId
      address
    }
  }
`;

export const LIST_USERS = gql`
  query users {
    users {
      userId
      msisdn
      active
    }
  }
`;

export const LIST_TRANSACTIONS = gql`
  query transactions {
    transactions {
      uuid
      rrn
      stan
      datetime
      type
      amt
      respCode
      authCode
    }
  }
`;
