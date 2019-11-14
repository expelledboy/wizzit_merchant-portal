import React from "react";
import { useHistory } from "react-router";
import { Grid } from "@material-ui/core";
import Login from "../components/Login";

export function LoginPage() {
  const history = useHistory();

  const onLogin = () => {
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
