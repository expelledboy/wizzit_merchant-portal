import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { IMerchantUser } from "../types.d";

import {
  makeStyles,
  Theme,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    minWidth: 600
  },
  title: {
    fontSize: 56
  }
}));

export function HomePage() {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{ me: IMerchantUser }>(
    CURRENT_USER
  );

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
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
          <Fragment>
            <Button size="small">Continue</Button>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login">
              <Button size="small">Login</Button>
            </Link>
          </Fragment>
        )}
      </CardActions>
    </Card>
  );
}
