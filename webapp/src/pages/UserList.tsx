import React from "react";
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
import { useQuery } from "@apollo/react-hooks";
import { LIST_USERS } from "../graphql/queries";
import { IUser } from "../types.d";
import { UserView } from "../components/UserList";
import { useHistory } from "react-router";
import { LOCALSTORAGE_TOKEN } from "../constants";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const UserList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    users: IUser[];
  }>(LIST_USERS);
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const history = useHistory();
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
            <TableCell>UUID</TableCell>
            <TableCell>MSISDN</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.users.map((user, idx) => <UserView key={idx} user={user} />)}
        </TableBody>
      </Table>
    </Paper>
  );
};
