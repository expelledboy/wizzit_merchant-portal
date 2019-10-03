const authenticate = `

mutation {
  login(
    email: "admin@wizzit-int.com"
    password: "~password~"
  ) {
    token
    error
  }
}

`;

const me = `

{
  me {
    email
    firstName
  }
}

`;

const signup = `

mutation {
  signup(
    merchant: {
      email: "admin@example.com"
      password: "~password~"
      firstName: "Betty"
      lastName: "Sue"
    }
  ) {
    token
  }
}

`;

const transactions = `

query {
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
const tabs = [authenticate, me, signup, transactions].map(query => ({
  endpoint: "/gql",
  query
}));

export const playground = {
  endpoint: "/gql",
  tabs
};
