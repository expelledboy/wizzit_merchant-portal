import React, {useReducer} from "react";
import { Save, Delete, Edit } from "@material-ui/icons";
import {
  Button,
  TableCell,
  TableRow,
  Checkbox, TextField
} from "@material-ui/core";
import { useMutation } from "@apollo/react-hooks";
import { IMerchant } from "../types.d";
import {
  EDIT_MERCHANT,
  DELETE_MERCHANT,
  SAVE_MERCHANT,
} from "../graphql/mutations";

export const MerchantView: React.FC<{ merchant: IMerchant }> = ({
  merchant
}) => {
  const [editMerchant] = useMutation<void>(EDIT_MERCHANT);
  const [deleteMerchant] = useMutation<void>(DELETE_MERCHANT);

  const {
    merchantId,
    name,
    merchantCode,
    terminalId,
    address,
    active
  } = merchant;

  return (
    <TableRow key={merchantId}>
      <TableCell>{merchantCode}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{terminalId}</TableCell>
      <TableCell>{address}</TableCell>
      <TableCell>
        <Checkbox disabled checked={active} color="primary" />
      </TableCell>
      <TableCell>
        <Button
          color="primary"
          onClick={() => editMerchant({ variables: { merchantId } })}
        >
          <Edit />
        </Button>
        <Button
          color="primary"
          onClick={() => deleteMerchant({ variables: { merchantId } })}
        >
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const MerchantEdit: React.FC<{ merchant: IMerchant }> = ({
merchant
}) => {
  const [data, dispatch] = useReducer((state: IMerchant, props: object) => {
    return { ...state, ...props };
  }, merchant);
  const { merchantId, name, merchantCode, address, terminalId, active } = data;

  const [editMerchant] = useMutation<void>(EDIT_MERCHANT);
  const [saveMerchant] = useMutation<void>(SAVE_MERCHANT);

  const onSave = async () => {
    await saveMerchant({
      variables: {
        merchant: {
          merchantId,
          name,
          merchantCode,
          address,
          terminalId,
          active
        }
      }
    });
    await editMerchant({ variables: { merchantId } });
  };

  return (
    <TableRow key={merchantId}>
      <TableCell>{merchantId}</TableCell>
      <TableCell>
        <TextField
          value={name}
          onChange={e => dispatch({ name: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={merchantCode}
          onChange={e => dispatch({ merchantCode: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <TextField
          value={address}
          onChange={e => dispatch({ address: e.target.value })}
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
