import React, { useCallback } from "react";
import { ITransaction } from "../types";
import gql from "graphql-tag";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Theme,
  Typography,
  Chip,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Select,
  MenuItem
} from "@material-ui/core";
import { useLazyQuery } from "@apollo/react-hooks";
import { useEffect } from "react";
import { exportItems } from "../@utils/exportCsv";
import { SearchBar } from "./SearchBar";

export const LOAD_MORE_TRANSACTIONS = gql`
  query LOAD_MORE_TRANSACTIONS($next: ID, $limit: Int, $filter: FilterInput) {
    transactions(next: $next, limit: $limit, filter: $filter) {
      next
      haveMore
      items {
        id
        type
        version
        amount
        msisdn
        merchantId
        createdAt
        authCode
        respCode
        status
        trxId
        refId
      }
    }
  }
`;

export const TRANSACTION_REPORT = gql`
  query TRANSACTION_REPORT($merchantId: ID, $date: String) {
    report(merchantId: $merchantId, date: $date) {
      id
      type
      version
      amount
      msisdn
      merchantId
      createdAt
      authCode
      respCode
      status
      trxId
    }
  }
`;

const useStyles = makeStyles((_theme: Theme) => ({
  record: {
    margin: "2px"
  },
  kv: {
    margin: "2px"
  },
  completed: {
    backgroundColor: "#a4c639"
  },
  pending: {
    backgroundColor: "#5d8aa8"
  },
  rolledback: {
    backgroundColor: "#9966cc"
  },
  processing: {
    backgroundColor: "#7fffd4"
  }
}));

const KeyValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <>
      <b>{label}</b>: {value}
      <br />
    </>
  );
};

const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
};

const Transaction = ({ data: trx }: any) => {
  const classes = useStyles();

  const transaction = ({
    single_entry: {
      type: "Single Entry"
    },
    scc: {
      type: "Secured Capture"
    },
    pay: {
      type: "Pay",
      detail: (
        <>
          <KeyValue label="Amount" value={trx.amount} />
          <KeyValue label="MSISDN" value={trx.msisdn} />
          <KeyValue label="Response" value={trx.respCode} />
        </>
      )
    },
    link_card: {
      type: "Link Card",
      detail: (
        <>
          <KeyValue label="MSISDN" value={trx.msisdn} />
          <KeyValue label="Response" value={trx.respCode} />
        </>
      )
    }
  } as any)[trx.type] || {
    type: "Unknown"
  };

  return (
    <TableRow key={trx.id}>
      <TableCell>
        <Chip
          label={trx.status}
          className={(classes as Record<string, string>)[trx.status]}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          <KeyValue label="Type" value={transaction.type} />
          <KeyValue label="Time" value={formatTimestamp(trx.createdAt)} />
          <KeyValue label="ID" value={trx.trxId} />
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {trx.refId && <KeyValue label="Ref" value={trx.refId} />}
          {trx.status === "completed" && transaction.detail}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export function Transactions() {
  // const classes = useStyles();
  const [limit] = useState(10);
  const [next, setNext] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const [callReport, { loading: reportActive }] = useLazyQuery<{
    report: ITransaction[];
  }>(TRANSACTION_REPORT, {
    fetchPolicy: "no-cache",
    displayName: "TRANSACTION_REPORT",
    onCompleted: ({ report }) => {
      exportItems(report, `wizzit-report-${month}-${year}`);
    }
  });

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [filter, setFilter] = useState({});

  const [loadMore, { loading, data, error }] = useLazyQuery<{
    transactions: {
      next: string;
      haveMore: boolean;
      items: any[];
    };
  }>(LOAD_MORE_TRANSACTIONS, {
    variables: { next, limit, filter },
    displayName: "LOAD_MORE_TRANSACTIONS",
    onCompleted: ({ transactions: { items } }) => {
      setItems(prev => [...prev, ...items]);
    }
  });

  const pickMonth = {
    years: [now.getFullYear(), now.getFullYear() - 1],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  };

  const requestReport = () => {
    callReport({
      variables: {
        // merchantId: data && data.me.merchantId,
        date: new Date(year, month, 1).toISOString().slice(0, 10)
      }
    });
  };

  useEffect(() => {
    loadMore();
  }, [loadMore, next, limit, filter]);

  const updateFilter = useCallback((filters: any[]) => {
    const filter = filters.reduce(
      (acc, item) => ({
        ...acc,
        [item.type]: item.value
      }),
      {}
    );
    setItems([]);
    setNext(null);
    setFilter(filter);
  }, []);

  if (error) {
    return <p>{error.message}</p>;
  }

  const exportView = () => {
    return exportItems(items, `wizzit-report`);
  };

  // XXX: https://github.com/AndyNormann/mvp-todo-frontend/blob/de9c421d5ff6449919e1afda89e9a6e062133cc1/src/Components/ListPage.js#L108
  return (
    <Card>
      <CardContent>
        <SearchBar onUpdate={updateFilter} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Transaction</TableCell>
              <TableCell>Detail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((trx: ITransaction) => (
              <Transaction key={trx.id} data={trx} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={exportView}>
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
                onClick={() => data && setNext(data.transactions.next)}
              >
                Load More
              </Button>
            )}
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        <Select
          id="select-year"
          value={year}
          onChange={(e: React.ChangeEvent<{ value: any }>) => {
            setYear(e.target.value);
          }}
        >
          {pickMonth.years.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
        <Select
          id="select-month"
          value={month}
          onChange={(e: React.ChangeEvent<{ value: any }>) => {
            setMonth(e.target.value);
          }}
        >
          {pickMonth.months.map(month => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
        <Button size="small" onClick={requestReport} disabled={reportActive}>
          Export Report
        </Button>
      </CardActions>
    </Card>
  );
}
