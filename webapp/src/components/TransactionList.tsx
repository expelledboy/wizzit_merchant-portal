import React from "react";
import { makeStyles } from "@material-ui/styles";
import { TableCell, TableRow, Paper, Theme } from "@material-ui/core";
import { ITransaction } from "../types.d";
import MaterialTable from "material-table";
import { LIST_TRANSACTIONS } from "../graphql/queries";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useHistory } from "react-router";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((_theme: Theme) => ({
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

export const TransactionList = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    transactions: ITransaction[];
  }>(LIST_TRANSACTIONS);
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
      {data ? (
        <MaterialTable
          columns={[
            { title: "UUID", field: "uuid" },
            { title: "RRN", field: "rrn" },
            { title: "STAN", field: "stan" },
            { title: "DateTime", field: "datetime" },
            { title: "Type", field: "type" },
            { title: "AMT", field: "amt" },
            { title: "Response", field: "respCode" },
            { title: "Auth Code", field: "authCode" }
          ]}
          data={data.transactions}
          title="Transaction"
        />
      ) : null}
    </Paper>
  );
};
