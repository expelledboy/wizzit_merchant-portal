import React, { useReducer } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { theme } from "./theme";
import { makeStyles, Theme, CssBaseline, Grid } from "@material-ui/core";

import { ApolloProvider } from "react-apollo";
import { gqlClient } from "./gql/client";

import { BrowserRouter, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { MerchantList } from "./components/MerchantList";
import { TransactionList } from "./components/TransactionList";

const useStyles = makeStyles((myTheme: Theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gridGap: "10px",
    gridTemplateRows: "80px 1fr 80px",
    height: "100%"
  },
  container: {
    gridColumn: "1/span 6"
  },
  header: {
    gridColumn: "1/span 6",
    color: "#fff"
  },
  footer: {
    gridColumn: "1/span 6",
    color: "#fff"
  }
}));

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <ApolloProvider client={gqlClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />

          <div className={classes.root}>
            <div className={classes.header}>
              <Header />
            </div>

            <div className={classes.container}>
              <Grid
                container
                justify="center"
                spacing={6}
                alignItems="center"
                direction="column"
              >
                <Grid item>
                  <Route path="/" exact component={Login} />
                  <Route path="/merchants" component={MerchantList} />
                  <Route path="/transactions" component={TransactionList} />
                </Grid>
              </Grid>
            </div>

            <div className={classes.footer}>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
