import React from "react";
import { ChevronLeft } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Theme, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: "rgba(255, 255, 255, 0.1)"
  },
  icon: {
    position: "relative",
    top: theme.spacing(0.4)
  }
}));

export interface IHeader {
  /** Function used to open nav */
  openNavBar: () => void;
}

export const Header = ({ openNavBar }: IHeader) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignItems="center"
    >
      <Grid item>
        <div onClick={openNavBar}>
          <ChevronLeft fontSize="large" className={classes.icon} />
        </div>
      </Grid>
      <Grid item>
        <Typography variant="caption">WIZZIT.PAY</Typography>
      </Grid>
    </Grid>
  );
};
