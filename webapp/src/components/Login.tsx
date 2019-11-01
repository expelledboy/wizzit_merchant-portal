import React, { useState, FormEvent } from "react";
import { ICredentials, IRegisterMerchantUser } from "../types.d";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField, makeStyles, Theme
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  cardAction: {
    justifyContent: "center"
  }
}));

interface ILoginProps {
  handleLogin: (creds: ICredentials) => void;
  handleSignUp: (merchantUser: IRegisterMerchantUser) => void;
}

// TODO: replace with `formik`

const Login = (props: ILoginProps) => {
  const { handleLogin, handleSignUp } = props;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [signUp, setSignUp] = useState<boolean>(false);
  const classes = useStyles();

  const onClickLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (handleLogin) {
      await handleLogin({
        email,
        password
      });
    }
  };

  const onClickSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!signUp) {
      return setSignUp(true);
    }
    if (handleSignUp) {
      await handleSignUp({
        email,
        password,
        firstName,
        lastName
      });
    }
  };

  return (
    <Card>
      <CardContent>
        <form>
          {signUp && (
            <React.Fragment>
              <TextField
                id="firstName"
                onChange={e => setFirstName(e.target.value)}
                label="First Name"
                type="text"
                fullWidth
                margin="normal"
              />
              <TextField
                id="lastName"
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
            onChange={e => setEmail(e.target.value)}
            label="Email"
            type="text"
            autoComplete="current-email"
            margin="normal"
            fullWidth
          />
          <TextField
            id="password"
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
        {!signUp && (
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
        <Button
          variant="contained"
          color={signUp ? "primary" : "secondary"}
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
