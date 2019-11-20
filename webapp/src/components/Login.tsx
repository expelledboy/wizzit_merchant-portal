import React, { useState, FormEvent } from "react";
import { useMutation } from "@apollo/react-hooks";
import { IAuthentication } from "../types.d";
import { LOGIN, SIGNUP } from "../graphql/mutations";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  TextField,
  makeStyles,
  Theme
} from "@material-ui/core";

const useStyles = makeStyles((_theme: Theme) => ({
  cardAction: {
    justifyContent: "right"
  }
}));

// TODO: replace with `formik`

const Login = ({ onLogin, ...state }: any) => {
  const classes = useStyles();

  const [email, setEmail] = useState<string>(state.email || "");
  const [password, setPassword] = useState<string>(state.password || "");
  const [firstName, setFirstName] = useState<string>(state.firstName || "");
  const [lastName, setLastName] = useState<string>(state.lastName || "");
  const [expandSignUp, setExpandSignUp] = useState<boolean>(
    state.expandSignUp !== undefined ? state.expandSignUp : false
  );
  const [error, setError] = useState<string>();

  const onCompleted = ({ token, error: authError }: IAuthentication) => {
    if (authError) {
      setError(authError);
    }

    if (token) {
      onLogin(token);
    }
  };

  const [login, { loading: loginLoading }] = useMutation<{
    login: IAuthentication;
  }>(LOGIN, {
    onCompleted(resp) {
      onCompleted(resp.login);
    }
  });

  const [signUp, { loading: signUpLoading }] = useMutation<{
    signup: IAuthentication;
  }>(SIGNUP, {
    onCompleted(resp) {
      onCompleted(resp.signup);
    }
  });

  const onClickLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    await login({
      variables: {
        email,
        password
      }
    });
  };

  const onClickSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!expandSignUp) {
      setExpandSignUp(true);
      setError("");
      return;
    }
    await signUp({
      variables: {
        merchant: {
          email,
          password,
          firstName,
          lastName
        }
      }
    });
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      if (expandSignUp) {
        onClickSignUp(e);
      } else {
        onClickLogin(e);
      }
    }
  };

  if (loginLoading || signUpLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <Card>
      <CardContent>
        <form>
          {expandSignUp && (
            <React.Fragment>
              <TextField
                id="firstName"
                defaultValue={firstName}
                onChange={e => setFirstName(e.target.value)}
                label="First Name"
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="lastName"
                defaultValue={lastName}
                onChange={e => setLastName(e.target.value)}
                label="Last Name"
                type="text"
                fullWidth
                margin="normal"
              />
            </React.Fragment>
          )}
          <TextField
            id="email"
            defaultValue={email}
            onChange={e => setEmail(e.target.value)}
            label="Email"
            type="text"
            autoComplete="current-email"
            margin="normal"
            fullWidth
          />
          <TextField
            id="password"
            defaultValue={password}
            onKeyDown={onEnterPress}
            onChange={e => setPassword(e.target.value)}
            label="Password"
            type="password"
            fullWidth
            autoComplete="current-password"
            margin="normal"
          />
        </form>
      </CardContent>
      <CardActions className={classes.cardAction}>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        {!expandSignUp && (
          <Button
            variant="contained"
            type="submit"
            color="primary"
            size="large"
            onClick={onClickLogin}
          >
            Login
          </Button>
        )}
        {expandSignUp && !error && (
          <Typography align="center">
            By signing up you agree the terms and conditions.
          </Typography>
        )}
        <Button
          variant="contained"
          color={expandSignUp ? "primary" : "secondary"}
          size="large"
          onClick={onClickSignUp}
        >
          Sign Up
        </Button>
      </CardActions>
    </Card>
  );
};

export default Login;
