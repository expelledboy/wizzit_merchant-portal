import React from "react";
import { LOGIN, SIGNUP } from "../graphql/mutations";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import MockBuilder from "../@utils/mock";
import Login from "./Login";

import { select } from "@storybook/addon-knobs";

const notes = `
  - Use empty credentials to get an error.
  - Use admin/admin to login.
  - Click signup to expand form to include input fields for registration.
`;

const mocks = new MockBuilder();

mocks
  .on(LOGIN, { email: "admin@example.com", password: "admin" })
  .respond({ login: { token: "s0a129n" } });

mocks
  .on(LOGIN, { email: "bad@email.com", password: "break" })
  .respond({ login: { error: "Failed to authenticate" } });

mocks
  .on(SIGNUP, {
    merchant: {
      email: "admin@example.com",
      password: "admin",
      firstName: "Admin",
      lastName: "Admin"
    }
  })
  .respond({ signup: { token: "s0a129n" } });

const apolloMock = mocks.build();

storiesOf("Login", module)
  .addDecorator(apolloMock)
  .add(
    "Invalid Creds",
    () => {
      const props = {
        email: "bad@email.com",
        password: "break"
      };
      return <Login {...props} />;
    },
    {
      notes: "Username/Password combo not found"
    }
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
  );
