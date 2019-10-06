import React from "react";

import {
  Paper,
  Theme,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox
} from "@material-ui/core";

import { Save, Delete, Edit } from "@material-ui/icons";

import { LIST_MERCHANT_USERS } from "../graphql/queries";
import { makeStyles } from "@material-ui/styles";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: "center"
  }
}));

export const MerchantList = (props: any) => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(LIST_MERCHANT_USERS);

  // TODO: add editing to local cache

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const editMode = (item: any, index: number) => (
    <TableRow key={item.id}>
      <TableCell>{item.id}</TableCell>
      <TableCell>
        <TextField
          label="Name"
          value={item.editItem.name}
          onChange={event => props.changeEdit(event, index, "name")}
        />
      </TableCell>
      <TableCell>
        <TextField
          label="Service"
          value={item.editItem.service}
          onChange={event => props.changeEdit(event, index, "service")}
        />
      </TableCell>
      <TableCell>
        <TextField
          label="Price"
          value={item.editItem.price}
          onChange={event => props.changeEdit(event, index, "price")}
        />
      </TableCell>
      <TableCell>
        <Button color="primary" onClick={() => props.save(index)}>
          <Save />
        </Button>
      </TableCell>
    </TableRow>
  );

  const viewMode = (item: any, index: number) => (
    <TableRow key={item.id}>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{item.firstName}</TableCell>
      <TableCell>{item.lastName}</TableCell>
      <TableCell>
        <Checkbox disabled checked={item.active} color="primary" />
      </TableCell>
      <TableCell>
        <Button color="primary" onClick={() => props.change(index)}>
          <Edit />
        </Button>
        <Button color="primary" onClick={() => props.delete(index)}>
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper className={classes.root}>
      <Table>
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
        <TableBody>
          {data.merchantUsers.map((item: any, index: number) => {
            console.log(item);
            if (item.editing) {
              return editMode(item, index);
            }
            return viewMode(item, index);
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};

// https://github.com/plodnik/react-material-crud-demo/blob/master/src/App.js
// https://github.com/plodnik/react-material-crud-demo/blob/master/src/Components/List/List.js
