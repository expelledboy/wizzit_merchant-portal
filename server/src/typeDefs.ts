import gql from "graphql-tag";

export const typeDefs = gql`
  type Merchant {
    id: ID!
    merchantId: String!
    name: String!
    merchantCode: String!
    terminalId: String!
    address: String!
    active: Boolean!
  }

  input MerchantInput {
    merchantId: String!
    name: String!
    merchantCode: String!
    terminalId: String!
    address: String!
  }

  type MerchantUser {
    id: ID!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    merchantId: Int
    active: Boolean!
  }

  input RegisterMerchantUserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input MerchantUserInput {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    active: Boolean!
  }

  type User {
    userId: String
    msisdn: String
    active: Boolean
  }

  type Card {
    id: ID!
    cardNumber: String
    userId: String
    active: Boolean
  }

  type Transaction {
    uuid: ID!
    rrn: String!
    stan: String!
    datetime: String!
    type: String!
    amt: Int!
    respCode: String
    authCode: String
  }

  type Authentication {
    token: String
    error: String
  }

  type Query {
    me: MerchantUser
    merchants: [Merchant]!
    merchantUsers: [MerchantUser]!
    users: [User]!
    transactions: [Transaction]!
    # users(first: Int, skip: Int, orderBy: String): [User]!
  }

  type Mutation {
    login(email: String!, password: String!): Authentication
    signup(merchant: RegisterMerchantUserInput!): Authentication
    saveMerchantUser(merchantUser: MerchantUserInput!): ID
    deleteMerchantUser(id: ID!): Boolean
    setUserActive(userId: ID!, active: Boolean!): Boolean
    # createMerchant(merchant: MerchantInput!): ID
    # createMerchantUser(merchantUser: MerchantUserInput!): ID
  }
`;
