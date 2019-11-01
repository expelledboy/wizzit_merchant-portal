import React from "react";
import { CreditCard } from "@material-ui/icons";
import {
  Button,
  TableCell,
  TableRow,
  Checkbox
} from "@material-ui/core";

import { useMutation } from "@apollo/react-hooks";
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
