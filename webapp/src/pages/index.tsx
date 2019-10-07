import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  createStyles,
  Theme,
  makeStyles,
  List,
  Drawer
} from "@material-ui/core";

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
import { ListLink } from "../components/ListLink";
import { MerchantUserList } from "../components/MerchantUserList";
import { MerchantList } from "../components/MerchantList";
import { UserList } from "../components/UserList";
import { TransactionList } from "../components/TransactionList";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);

export interface INavBar {
  /** Nav bar open state */
  open: boolean;
  /** Close nav callback */
  closeNavBar: () => void;
}

export const NavBar = ({ open, closeNavBar, ...props }: INavBar) => {
  const classes = useStyles();

  return (
    <Drawer
      open={open}
      ModalProps={{
        onBackdropClick: closeNavBar
      }}
    >
      <List className={classes.root} component="nav">
        <ListLink to="/" icon={Home} text="Home" />
        <ListLink to="/merchants" icon={Folder} text="Merchants" />
        <ListLink to="/users" icon={FolderShared} text="Users" />
        <ListLink to="/clients" icon={Person} text="Clients" />
        <ListLink to="/transactions" icon={AttachMoney} text="Transactions" />
      </List>
    </Drawer>
  );
};
