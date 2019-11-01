import React, { useState, useEffect, useCallback } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "./theme";
import { makeStyles, Theme, CssBaseline, Grid } from "@material-ui/core";

import { ApolloProvider } from "react-apollo";
import { gqlClient } from "./graphql/client";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Pages, NavBar } from "./pages/index";

const useStyles = makeStyles((myTheme: Theme) => ({
  root: {
    display: "grid",
    gridGap: "10px",
    height: "100%"
  },
  container: {
    gridColumn: "1/span 6",
    height: "100%"
  },
  header: {
    gridColumn: "1/span 6",
    color: "#fff"
  },
  nav: {
    height: "100%"
  },
  footer: {
    gridColumn: "1/span 6",
    color: "#fff",
    position: "fixed",
    bottom: 0,
    width: "100%"
  }
}));

const history = createBrowserHistory();

const App: React.FC = () => {
  const classes = useStyles();

  const [navBarOpen, setNavBarOpen] = useState<boolean>(false);
  const openNavBar = useCallback(() => setNavBarOpen(true), []);
  const closeNavBar = useCallback(() => setNavBarOpen(false), []);

  useEffect(() => history.listen(closeNavBar));

  return (
    <ApolloProvider client={gqlClient}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <CssBaseline />
          <div className={classes.root}>
            <div className={classes.header}>
              <Header openNavBar={openNavBar} />
            </div>
            <div className={classes.container}>
              <Grid container alignItems="center" direction="column">
                <Grid item>
                  <Pages />
                </Grid>
              </Grid>
            </div>
            <div className={classes.footer}>
              <Footer />
            </div>
            <div className={classes.nav}>
              <NavBar open={navBarOpen} closeNavBar={closeNavBar} />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
