import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { IMerchantUser } from "../types.d";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 1200,
    margin: "2rem auto",
    boxShadow: "0 12px 24px 0 rgba(0, 0, 0, 0.09)",
    display: "grid",
    gridAutoColumns: "1fr",
    gridAutoFlow: "column",
    minHeight: "15%"
  },
  image: {
    width: "100%",
    height: 400,
    objectFit: "cover"
  },
  info: {
    lineHeight: 2,
    fontWeight: 300,
    flexGrow: 1,
    padding: "0 3rem",
    fontSize: "1.5rem"
  },
  buttonList: {
    display: "grid",
    width: "100%",
    borderTop: `1px solid ${theme.palette.primary.light}`,
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gridGap: 1,
    background: `${theme.palette.primary.light}`
  }
}));

interface IMerchantProps {
  user: IMerchantUser;
}

export const Merchant = ({ user }: IMerchantProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h3>
        <Link to={`/user/${user.id}`}>
          <a>{`${user.firstName} ${user.lastName}`}</a>
        </Link>
      </h3>
      <p>{user.email}</p>

      <div className={classes.buttonList}>
        <Link to={`/update/${user.id}`}>
          <a>Edit</a>
        </Link>
      </div>
    </div>
  );
};
