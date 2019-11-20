import React from "react";
import { IMocks } from "graphql-tools";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { createApolloProvider } from "../@utils/apollo-decorator";
import Login from "./Login";

const auth = ({ email, password }) => {
  if (email === "admin@example.com" && password === "admin")
    return {
      token: "0n9sn915n1925n",
      error: null
    };

  return {
    token: null,
    error: "Failed to authenticate"
  };
};

const mocks: IMocks = {
  Mutation: () => ({
    login(_root, credentials) {
      return auth(credentials);
    },
    signup(_root, { merchant }) {
      return auth(merchant);
    }
  })
};

storiesOf("Login", module)
  .addDecorator(
    createApolloProvider({
      mocks
    })
  )
  .add(
    "Login",
    () => {
      const props = {
        email: "admin@example.com",
        password: "admin",
        onLogin: action("onClickLogin")
      };
      return <Login {...props} />;
    },
    {
      notes: "Valid credentials for login"
    }
  )
  .add(
    "Signup",
    () => {
      const props = {
        email: "admin@example.com",
        password: "admin",
        firstName: "Admin",
        lastName: "Admin",
        expandSignUp: true,
        onLogin: action("onClickSignUp")
      };
      return <Login {...props} />;
    },
    {
      notes: "Valid details needed for registartion"
    }
  )
  .add(
    "Invalid Details",
    () => {
      const props = {
        email: "bad@email.com",
        password: "break",
        firstName: "Admin",
        lastName: "Admin"
      };
      return <Login {...props} />;
    },
    {
      notes: "Username/Password combo not found"
    }
  );
