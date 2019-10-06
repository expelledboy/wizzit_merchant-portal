import React, { useReducer } from "react";

import { useMutation } from "@apollo/react-hooks";
import { Save, Delete, Edit } from "@material-ui/icons";
import {
  Button,
  TableCell,
  TableRow,
  TextField,
  Checkbox
} from "@material-ui/core";

import { IMerchantUser } from "../types.d";
import {
  EDIT_MERCHANT_USER,
  DELETE_MERCHANT_USER,
  SAVE_MERCHANT_USER
} from "../graphql/mutations";

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
          onChange={(e, checked) => dispatch({ active: checked })}
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
