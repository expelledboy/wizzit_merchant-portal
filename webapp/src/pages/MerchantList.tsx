import React from "react";
import {useHistory} from "react-router";
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

import { LIST_MERCHANTS } from "../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { IMerchant } from "../types.d";
import { MerchantView, MerchantEdit } from "../components/MerchantList";
import {LOCALSTORAGE_TOKEN} from "../constants";

export const MerchantList = (props: any) => {
  const { loading, error, data } = useQuery<{
    merchants: IMerchant[];
  }>(LIST_MERCHANTS);
  const history = useHistory();
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

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
    <Paper>
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
          {data && data.merchants.map((merchant, idx) => {
            return merchant.editting ? (
              <MerchantEdit key={idx} merchant={merchant} />
            ) : (
              <MerchantView key={idx} merchant={merchant} />
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};
