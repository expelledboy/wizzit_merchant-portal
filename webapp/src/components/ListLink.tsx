import React, { FC } from "react";
import { NavLink } from "react-router-dom";

import {
  createStyles,
  Theme,
  makeStyles,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

export interface IListLink {
  /** Nav link icon */
  icon: any;
  /** Path used for navigation */
  to: string;
  /** Link description */
  text: string;
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      button: {
        color: "black",
        textDecoration: "none"
      },
      active: {
        "& svg": {
          fill: theme.palette.primary.main
        },
        color: theme.palette.primary.main,
        textDecoration: "none"
      }
    }),
  { name: "ListLink" }
);

export const ListLink: FC<IListLink> = ({ to, icon: Icon, text }) => {
  const classes = useStyles();

  return (
    <NavLink
      exact
      to={to}
      className={classes.button}
      activeClassName={classes.active}
    >
      <ListItem button>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </NavLink>
  );
};
