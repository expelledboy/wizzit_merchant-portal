import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Edit } from "@material-ui/icons";
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

import { LIST_MERCHANTS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { IMerchant } from "../types.d";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const MerchantView: React.FC<{ merchant: IMerchant }> = ({
  merchant
}) => {
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
        <Button color="primary">
          <Edit />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const MerchantList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    merchants: IMerchant[];
  }>(LIST_MERCHANTS);

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
            <TableCell>Merchant Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Terminal ID</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.merchants.map((merchant, idx) => (
              <MerchantView key={idx} merchant={merchant} />
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
