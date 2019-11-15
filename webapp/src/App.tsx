import React, { FormEvent } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/styles";
import { useLocalStorage } from "@rehooks/local-storage";

import {
  makeStyles,
  createStyles,
  Theme,
  CssBaseline,
  Toolbar,
  Typography,
  AppBar,
  Divider,
  Drawer,
  Button
} from "@material-ui/core";
import { theme } from "./theme";
import Logo from "./logo.png";
import { Lock, ContactSupport, LockOpen } from "@material-ui/icons";
// https://material.io/resources/icons/?style=baseline

import { ApolloProvider } from "@apollo/react-hooks";
import { gqlClient } from "./graphql/client";

import { Pages, Links } from "./pages/index";
import { LOCALSTORAGE_TOKEN } from "./constants";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    pageTitle: {
      flexGrow: 1
    },
    logo: {
      objectFit: "cover",
      padding: theme.spacing(2)
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    footer: {
      position: "fixed",
      padding: theme.spacing(4, 2),
      color: "#fff",
      bottom: 0,
      width: "100%"
    }
  })
);

const history = createBrowserHistory();

const App: React.FC = () => {
  const classes = useStyles();

  const [token, _setToken, deleteToken] = useLocalStorage(LOCALSTORAGE_TOKEN);

  const onClickLogin = async (e: FormEvent) => {
    e.preventDefault();
    history.push("/login");
  };

  const onClickLogout = async (e: FormEvent) => {
    e.preventDefault();
    deleteToken();
    history.push("/login");
  };

  return (
    <ApolloProvider client={gqlClient}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                {/* TODO: https://material-ui.com/components/breadcrumbs/#integration-with-react-router */}
                <Typography variant="h6" className={classes.pageTitle} noWrap>
                  Merchant Portal
                </Typography>
                <Button color="inherit">
                  <ContactSupport /> Contact Us
                </Button>
                {token ? (
                  <Button color="inherit" onClick={onClickLogout}>
                    <LockOpen /> Logout
                  </Button>
                ) : (
                  <Button color="inherit" onClick={onClickLogin}>
                    <Lock /> Login
                  </Button>
                )}
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper
              }}
              anchor="left"
            >
              <img src={Logo} alt="Wizzit Logo" className={classes.logo} />
              <Divider />
              <Links />
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Pages />
              <div className={classes.footer}>
                &copy; Wizzit {new Date().getFullYear()}
              </div>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
