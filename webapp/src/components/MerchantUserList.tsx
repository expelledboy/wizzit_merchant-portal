import React from "react";

import { makeStyles } from "@material-ui/styles";
import {
  Paper,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Button
} from "@material-ui/core";
import { Save, Delete, Edit } from "@material-ui/icons";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { IMerchantUser } from "../types.d";
import { LIST_MERCHANT_USERS } from "../graphql/queries";
import {
  DELETE_MERCHANT_USER,
  EDIT_MERCHANT_USER,
  SAVE_MERCHANT_USER
} from "../graphql/mutations";
import { useReducer } from "react";

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const MerchantUserView: React.FC<{ user: IMerchantUser }> = ({
  user
}) => {
  const [editMerchantUser] = useMutation<void>(EDIT_MERCHANT_USER);
  const [deleteMerchantUser] = useMutation<void>(DELETE_MERCHANT_USER);
  const { id, email, firstName, lastName, active } = user;

  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>
        <Checkbox disabled checked={active} color="primary" />
      </TableCell>
      <TableCell>
        <Button
          color="primary"
          onClick={() => editMerchantUser({ variables: { id } })}
        >
          <Edit />
        </Button>
        <Button
          color="primary"
          onClick={() => deleteMerchantUser({ variables: { id } })}
        >
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const MerchantUserEdit: React.FC<{ user: IMerchantUser }> = ({
  user
}) => {
  const [data, dispatch] = useReducer((state: IMerchantUser, props: object) => {
    return { ...state, ...props };
  }, user);
  const { id, email, firstName, lastName, active } = data;

  const [editMerchantUser] = useMutation<void>(EDIT_MERCHANT_USER);
  const [saveMerchantUser] = useMutation<void>(SAVE_MERCHANT_USER);

  const onSave = async () => {
    await saveMerchantUser({
      variables: {
        merchantUser: {
          id,
          email,
          firstName,
          lastName,
          active
        }
      }
    });
    await editMerchantUser({ variables: { id } });
  };

  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>
        <TextField
          value={email}
          onChange={e => dispatch({ email: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={firstName}
          onChange={e => dispatch({ firstName: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={lastName}
          onChange={e => dispatch({ lastName: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={active}
          onChange={(_e, checked) => dispatch({ active: checked })}
          color="primary"
        />
      </TableCell>
      <TableCell>
        <Button color="primary" onClick={onSave}>
          <Save />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const MerchantUserList = (_props: any) => {
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
      <Table size="small" aria-label="a dense table">
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
        {data && (
          <TableBody>
            {data.merchantUsers.map((user, idx) => {
              return user.editting ? (
                <MerchantUserEdit key={idx} user={user} />
              ) : (
                <MerchantUserView key={idx} user={user} />
              );
            })}
          </TableBody>
        )}
      </Table>
    </Paper>
  );
};
