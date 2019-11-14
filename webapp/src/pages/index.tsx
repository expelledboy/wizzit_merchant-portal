import React from "react";
import { Route, Switch } from "react-router-dom";
import { List } from "@material-ui/core";

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
import { MerchantList } from "./MerchantList";
import { UserList } from "./UserList";
import { MerchantUserList } from "./MerchantUserList";
import { TransactionList } from "./TransactionList";
import { ListLink } from "../components/ListLink";

export const Pages = () => (
  <Switch>
    <Route path="/" exact component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/merchants" component={MerchantList} />
    <Route path="/users" component={MerchantUserList} />
    <Route path="/clients" component={UserList} />
    <Route path="/transactions" component={TransactionList} />
    {
      // <Route path="/courses" exact component={Courses} />
      // <Route path="/courses/:slug" component={Course} />
      // <Route path="/course-categories/:slug" component={CourseCategory} />
      // <Route path="/sign-up" exact component={SignUp} />
      // <Route path="/log-in" exact component={LogIn} />
      // <Route path="/log-out" exact component={LogOut} />
      // <Route path="/set-password" exact component={SetPassword} />
      // <Route path="/" component={Home} />
    }
  </Switch>
);

// XXX: Dont break this out, as its coupled to Pages anyway.
export const Links = () => (
  <List component="nav">
    <ListLink to="/" icon={Home} text="Home" />
    <ListLink to="/merchants" icon={Folder} text="Merchants" />
    <ListLink to="/users" icon={FolderShared} text="Users" />
    <ListLink to="/clients" icon={Person} text="Clients" />
    <ListLink to="/transactions" icon={AttachMoney} text="Transactions" />
  </List>
);
