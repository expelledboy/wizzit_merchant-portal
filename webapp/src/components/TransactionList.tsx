import React from "react";
import {
  TableCell,
  TableRow
} from "@material-ui/core";
import { ITransaction } from "../types.d";

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
