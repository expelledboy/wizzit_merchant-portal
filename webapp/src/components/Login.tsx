import React, { useState, FormEvent } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Theme,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  FormHelperText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import logo from "../logo.svg";
import { useApolloClient, useMutation } from "react-apollo";
import { LOGIN } from "../gql/mutations";
import { History } from "history";
import { LOCALSTORAGE_TOKEN } from "../constants";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    minWidth: "350px"
  },
  button: {
    marginTop: theme.spacing(2),
    textTransform: "none"
  },
  textField: {
    display: "block"
  },
  accessBtn: {
    textTransform: "none",
    color: "rgba(255,255,255,0.8)",
    marginTop: theme.spacing(2)
  }
}));

export function Login(props: { history: History }) {
  const classes = useStyles();
  const { history } = props;

  // XXX: dont put this into state
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();

  const client = useApolloClient();

  const [login, { loading }] = useMutation<{
    login: {
      token: string;
      error: string;
    };
  }>(LOGIN, {
    onCompleted({ login: { token, error: authError } }) {
      console.log({
        token,
        authError
      });

      if (authError) {
        setError(authError);
      }

      if (token) {
        localStorage.setItem(LOCALSTORAGE_TOKEN, token);
        client.writeData({ data: { isLoggedIn: true } });
        history.push("/transactions");
      }
    }
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    await login({
      variables: {
        email,
        password
      }
    });
  };

  return (
    <Grid
      container
      justify="center"
      spacing={6}
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <img src={logo} alt="wizzit_pay logo" />
      </Grid>
      <Grid item>
        <Paper className={classes.root}>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            component="h5"
          >
            Welcome to Wizzit Pay
          </Typography>
          <form onSubmit={handleLogin}>
            {error && <FormHelperText error>{error}</FormHelperText>}

            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              type="text"
              autoComplete="current-email"
              margin="normal"
              fullWidth
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              className={classes.textField}
              type="password"
              fullWidth
              autoComplete="current-password"
              margin="normal"
              onChange={e => setPassword(e.target.value)}
            />

            <Grid spacing={6} container direction="row" alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox value="rememberMe" color="primary" />}
                  label={<Typography variant="caption">Remember me</Typography>}
                />
              </Grid>
              <Grid item>
                <Link color="secondary" variant="caption">
                  Forgot your password?
                </Link>
              </Grid>
            </Grid>

            <Button
              type="submit"
              className={classes.button}
              fullWidth
              color="secondary"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
