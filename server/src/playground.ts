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

const tabs = [authenticate, me, signup].map(query => ({
  endpoint: "/gql",
  query
}));

export const playground = {
  endpoint: "/gql",
  tabs
};
