import React from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/styles";
import {
  Paper,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { MerchantUserView, MerchantUserEdit } from "../components/MerchantUser";

import { LIST_MERCHANT_USERS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { IMerchantUser } from "../types.d";
import { LOCALSTORAGE_TOKEN } from "../constants";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const MerchantUserList = (props: any) => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

  const { loading, error, data } = useQuery<{
    merchantUsers: IMerchantUser[];
  }>(LIST_MERCHANT_USERS);

  if (token === null || token === undefined) {
    history.push("/login");
  }

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.merchantUsers.map((user, idx) => {
              return user.editting ? (
                <MerchantUserEdit key={idx} user={user} />
              ) : (
                <MerchantUserView key={idx} user={user} />
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
};
