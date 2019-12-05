import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  makeStyles,
  Theme,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from "@material-ui/core";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { IUser } from "../types";

const useStyles = makeStyles((_theme: Theme) => ({
  card: {
    minWidth: 600
  },
  title: {
    fontSize: 56
  }
}));

export const CURRENT_USER = gql`
  query CURRENT_USER {
    me {
      id
      email
      firstName
      lastName
      merchantId
      active
    }
  }
`;

export function HomePage() {
  const history = useHistory();
  const classes = useStyles();
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

  const { loading, error, data } = useQuery<{ me: IUser }>(CURRENT_USER, {
    displayName: "CURRENT_USER"
  });

  if (token === null || token === undefined) {
    history.push("/login");
  }

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error || !data) {
    history.push("/login");
    // return <p>Error: {error.message}</p>;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        {data && data.me ? (
          <Fragment>
            <Typography className={classes.title} gutterBottom>
              Welcome, {data.me.firstName}!
            </Typography>
            <Typography>
              You are currently logged in as {data.me.email}
            </Typography>
          </Fragment>
        ) : (
          <Fragment>
            <Typography className={classes.title} gutterBottom>
              Welcome!
            </Typography>
            <Typography>You are not logged in..</Typography>
          </Fragment>
        )}
      </CardContent>
      <CardActions>
        {data && data.me ? (
          <>
            <Link to="/transactions">
              <Button size="small">Continue</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button size="small">Login</Button>
            </Link>
          </>
        )}
      </CardActions>
    </Card>
  );
}
