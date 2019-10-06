import React, { useState } from "react";
import { useHistory } from "react-router";
import { useApolloClient, useMutation } from "react-apollo";
import { LOGIN, SIGNUP } from "../graphql/mutations";
import { LOCALSTORAGE_TOKEN } from "./../constants";
import { Grid, Card, Typography } from "@material-ui/core";
import {
  IAuthentication,
  ICredentials,
  IRegisterMerchantUser
} from "../types.d";
import Login from "../components/Login";

export function LoginPage() {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const client = useApolloClient();

  const onCompleted = ({ token, error: authError }: IAuthentication) => {
    if (authError) {
      setError(authError);
    }

    console.log({
      token,
      authError
    });

    if (token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      client.writeData({ data: { isLoggedIn: true } });
      history.push("/");
    }
  };

  const [login, { loading: loginLoading }] = useMutation<{
    login: IAuthentication;
  }>(LOGIN, {
    onCompleted(resp) {
      return onCompleted(resp.login);
    }
  });

  const [signUp, { loading: signUpLoading }] = useMutation<{
    signup: IAuthentication;
  }>(SIGNUP, {
    onCompleted(resp) {
      return onCompleted(resp.signup);
    }
  });

  const handleLogin = async (credentials: ICredentials) => {
    await login({
      variables: credentials
    });
  };

  const handleSignUp = async (merchantUser: IRegisterMerchantUser) => {
    await signUp({
      variables: { merchant: merchantUser }
    });
  };

  const loginProps = {
    handleLogin,
    handleSignUp
  };

  if (loginLoading || signUpLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <Login {...loginProps} />
      </Grid>
      {error && (
        <Grid item>
          <Card>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
