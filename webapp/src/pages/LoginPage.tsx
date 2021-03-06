import React from "react";
import { useHistory } from "react-router";
import { Grid } from "@material-ui/core";
import Login from "../components/Login";
import useLocalStorage from "@rehooks/local-storage";
import { LOCALSTORAGE_TOKEN } from "../constants";

export function LoginPage() {
  const history = useHistory();
  const setToken = useLocalStorage(LOCALSTORAGE_TOKEN)[1];

  const onLogin = (token: string) => {
    setToken(token);
    history.push("/");
  };

  const loginProps = {
    onLogin
  };

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <Login {...loginProps} />
      </Grid>
    </Grid>
  );
}
