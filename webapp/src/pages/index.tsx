import React from "react";
import { Route, Switch } from "react-router-dom";
import { List } from "@material-ui/core";
import jwtDecode from "jwt-decode";

// https://material.io/resources/icons/?style=baseline
import {
  Home,
  Folder,
  FolderShared,
  Person,
  AttachMoney
} from "@material-ui/icons";

import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { Merchants } from "../components/Merchants";
import { Users } from "../components/Users";
import { Clients } from "../components/Clients";
import { ListLink } from "../components/ListLink";
import { LOCALSTORAGE_TOKEN } from "../constants";
import useLocalStorage from "@rehooks/local-storage";

export const Pages = () => (
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/merchants" component={Merchants} />
    <Route path="/users" component={Users} />
    <Route path="/clients" component={Clients} />
  </Switch>
);

// XXX: Dont break this out, as its coupled to Pages anyway.
export const Links = () => {
  const token = useLocalStorage(LOCALSTORAGE_TOKEN)[0];
  const payload: any = token ? jwtDecode(token) : {};
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && payload.role === "Admin";

  console.log({ token, isAdmin, payload, isLoggedIn });

  return (
    <List component="nav">
      <ListLink to="/" icon={Home} text="Home" />
      {isAdmin && (
        <>
          <ListLink to="/merchants" icon={Folder} text="Merchants" />
          <ListLink to="/users" icon={FolderShared} text="Users" />
          <ListLink to="/clients" icon={Person} text="Clients" />
        </>
      )}
      {isLoggedIn && (
        <>
          <ListLink to="/transactions" icon={AttachMoney} text="Transactions" />
        </>
      )}
    </List>
  );
};
