import React, {forwardRef} from "react";
import {useHistory} from "react-router";
import { makeStyles } from "@material-ui/styles";
import {
  Paper,
  Theme,
} from "@material-ui/core";

import { LIST_TRANSACTIONS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { ITransaction } from "../types.d";
import MaterialTable from "material-table";
import {LOCALSTORAGE_TOKEN} from "../constants";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const TransactionList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<{
    transactions: ITransaction[];
  }>(LIST_TRANSACTIONS);
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
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
      {data ? <MaterialTable
        columns={[
          { title: "UUID", field: "uuid" },
          { title: "RRN", field: "rrn" },
          { title: "STAN", field: "stan"},
          { title: "DateTime", field: "datetime"},
          { title: "Type", field: "type"},
          { title: "AMT", field: "amt"},
          { title: "Response", field: "respCode"},
          { title: "Auth Code", field: "authCode"}
        ]}
        data={data.transactions}
        title="Transaction"
      /> : null }
    </Paper>
  );
};
