import React from "react";
import { ITransaction } from "../types";
import gql from "graphql-tag";
import { useState } from "react";
import { CsvBuilder } from "filefy";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Theme,
  List,
  ListItem,
  Typography
} from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { useEffect } from "react";

export const LOAD_MORE_TRANSACTIONS = gql`
  query($cursor: ID, $limit: Int) {
    transactions(cursor: $cursor, limit: $limit) {
      cursor
      haveMore
      items {
        id
        amount
      }
    }
  }
`;

const useStyles = makeStyles((_theme: Theme) => ({
  record: {
    margin: "2px"
  },
  kv: {
    margin: "2px"
  }
}));

const KeyValue = ({ label, value }: { label: string; value: string }) => {
  const classes = useStyles();

  return (
    <Typography className={classes.kv} variant="body1">
      <b>{label}</b>: {value}
    </Typography>
  );
};

const formatTransaction = (trx: any) => {
  switch (trx.__typename) {
    case "Transaction":
      return (
        <>
          <KeyValue label="Amount" value={trx.amount} />
        </>
      );
    default:
      return JSON.stringify(trx);
  }
};

export function Transactions() {
  const classes = useStyles();
  const [limit] = useState(10);
  const [cursor, setCursor] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const { loading, data, error, fetchMore } = useQuery<{
    transactions: {
      cursor: string;
      haveMore: boolean;
      items: any[];
    };
  }>(LOAD_MORE_TRANSACTIONS, {
    variables: { cursor, limit }
  });

  useEffect(() => {
    fetchMore({
      query: LOAD_MORE_TRANSACTIONS,
      variables: { cursor, limit },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const moreItems = fetchMoreResult
          ? fetchMoreResult.transactions.items
          : [];

        setItems(prev => [...prev, ...moreItems]);

        return fetchMoreResult;
      }
    });
  }, [fetchMore, cursor, limit]);

  if (error) {
    return <p>{error.message}</p>;
  }

  const exportItems = () => {
    const types: string[] = [];
    const headers: string[] = [];

    items.forEach(item => {
      if (types.includes(item.__typename)) {
        return;
      }

      Object.keys(item).forEach((key: string) => {
        if (headers.includes(key)) {
          return;
        }

        if (key === "__typename") {
          return;
        }

        headers.push(key);
      });
    });

    const builder = new CsvBuilder("transactions.csv");

    const flatmap = items.map(item => {
      return headers.reduce((acc: string[], header: string) => {
        acc.push(!!item[header] ? item[header] : null);
        return acc;
      }, []);
    });

    builder
      .setDelimeter(",")
      .setColumns(headers)
      .addRows(flatmap)
      .exportFile();
  };

  // XXX: https://github.com/AndyNormann/mvp-todo-frontend/blob/de9c421d5ff6449919e1afda89e9a6e062133cc1/src/Components/ListPage.js#L108
  return (
    <Card>
      <CardContent>
        <List component="nav">
          {items.map((trx: ITransaction) => {
            return (
              <ListItem key={trx.uuid} className={classes.record} divider>
                {formatTransaction(trx)}
              </ListItem>
            );
          })}
        </List>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={exportItems}>
          Export
        </Button>
        {loading ? (
          <p>loading...</p>
        ) : (
          <>
            {data && data.transactions.haveMore && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => data && setCursor(data.transactions.cursor)}
              >
                Load More
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
}
