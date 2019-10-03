import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    color: "#fff",
    textAlign: "center"
  }
}));

export function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>&copy; Wizzit {new Date().getFullYear()}</div>
  );
}
