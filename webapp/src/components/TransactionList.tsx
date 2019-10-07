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

import { LIST_TRANSACTIONS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { ITransaction } from "../types.d";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const TransactionView: React.FC<{ transaction: ITransaction }> = ({
  transaction: trx
}) => {
  return (
    <TableRow key={trx.uuid}>
      <TableCell>{trx.uuid}</TableCell>
      <TableCell>{trx.rrn}</TableCell>
      <TableCell>{trx.stan}</TableCell>
      <TableCell>{trx.datetime}</TableCell>
      <TableCell>{trx.type}</TableCell>
      <TableCell>{trx.amt}</TableCell>
      <TableCell>{trx.respCode}</TableCell>
      <TableCell>{trx.authCode}</TableCell>
    </TableRow>
  );
};

export const TransactionList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    transactions: ITransaction[];
  }>(LIST_TRANSACTIONS);

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
            <TableCell>RRN</TableCell>
            <TableCell>STAN</TableCell>
            <TableCell>DateTime</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>AMT</TableCell>
            <TableCell>Response</TableCell>
            <TableCell>Auth Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.transactions.map((trx, idx) => (
              <TransactionView key={idx} transaction={trx} />
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
