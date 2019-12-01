import React from "react";
import { ITransaction } from "../types";
// import useInfiniteScroll from "../hooks/useInfiniteScroll";
import gql from "graphql-tag";
import { useState } from "react";
import { Button } from "@material-ui/core";
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

export function Transactions() {
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

  // XXX: https://github.com/AndyNormann/mvp-todo-frontend/blob/de9c421d5ff6449919e1afda89e9a6e062133cc1/src/Components/ListPage.js#L108
  return (
    <>
      {items.map((trx: ITransaction) => {
        return JSON.stringify(trx);
      })}
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
              Next Page
            </Button>
          )}
        </>
      )}
    </>
  );
}
