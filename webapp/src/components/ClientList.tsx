import React from "react";
import { CreditCard } from "@material-ui/icons";
import {
  Button,
  TableCell,
  TableRow,
  Checkbox,
  TableBody,
  TableHead,
  Table,
  Paper,
  makeStyles,
  Theme
} from "@material-ui/core";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { SET_USER_ACTIVE } from "../graphql/mutations";

import { IClient } from "../types.d";
import { LIST_USERS } from "../graphql/queries";
import { useHistory } from "react-router";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { FormEvent } from "react";

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const UserView: React.FC<{ user: IClient }> = ({ user }) => {
  const { userId, msisdn, active } = user;

  const [setUserActive] = useMutation<void>(SET_USER_ACTIVE);

  return (
    <TableRow key={userId}>
      <TableCell>{msisdn}</TableCell>
      <TableCell>
        <Checkbox
          checked={active}
          color="primary"
          onChange={(_e: FormEvent, checked) =>
            setUserActive({ variables: { userId, active: checked } })
          }
        />
      </TableCell>
      <TableCell>
        <Button color="primary">
          <CreditCard />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const ClientList = (_props: any) => {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

  const { loading, error, data } = useQuery<{
    users: IClient[];
  }>(LIST_USERS);

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
            <TableCell>MSISDN</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        {data && (
          <TableBody>
            {data.users.map((user: IClient, idx: number) => (
              <UserView key={idx} user={user} />
            ))}
          </TableBody>
        )}
      </Table>
    </Paper>
  );
};
