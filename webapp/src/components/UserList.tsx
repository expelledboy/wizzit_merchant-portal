import React from "react";

import { CreditCard } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import {
  Paper,
  Theme,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox
} from "@material-ui/core";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { LIST_USERS } from "../graphql/queries";
import { SET_USER_ACTIVE } from "../graphql/mutations";

import { IUser } from "../types.d";

export const UserView: React.FC<{ user: IUser }> = ({ user }) => {
  const [setUserActive] = useMutation<void>(SET_USER_ACTIVE);
  const { userId, msisdn, active } = user;

  return (
    <TableRow key={userId}>
      <TableCell>{userId}</TableCell>
      <TableCell>{msisdn}</TableCell>
      <TableCell>
        <Checkbox
          checked={active}
          color="primary"
          onChange={(e, checked) =>
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
