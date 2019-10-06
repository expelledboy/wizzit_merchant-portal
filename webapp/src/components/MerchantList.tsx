import React from "react";

import {
  Paper,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { LIST_MERCHANT_USERS } from "../graphql/queries";
import { makeStyles } from "@material-ui/styles";
import { useQuery } from "@apollo/react-hooks";

import { IMerchantUser } from "../types.d";
import { MerchantUserView, MerchantUserEdit } from "./MerchantUser";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const MerchantList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    merchantUsers: IMerchantUser[];
  }>(LIST_MERCHANT_USERS);

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
