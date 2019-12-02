import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { IUser, ITransaction } from "../types.d";
import { CsvBuilder } from "filefy";
import gql from "graphql-tag";

import {
  makeStyles,
  Theme,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Select,
  MenuItem
} from "@material-ui/core";
import { LOCALSTORAGE_TOKEN } from "../constants";

const useStyles = makeStyles((_theme: Theme) => ({
  card: {
    minWidth: 600
  },
  title: {
    fontSize: 56
  }
}));

export const CURRENT_USER = gql`
  query {
    me {
      id
      email
      firstName
      lastName
      merchantId
      active
    }
  }
`;

export const TRANSACTION_REPORT = gql`
  query($merchantId: ID, $date: String) {
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

const exportItems = (items: any[]) => {
  const types: string[] = [];
  const headers: string[] = [];

  items.forEach((item: any) => {
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

  const builder = new CsvBuilder("report.csv");

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

export function HomePage() {
  const history = useHistory();
  const classes = useStyles();
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

  const { loading, error, data } = useQuery<{ me: IUser }>(CURRENT_USER);

  const [callReport, { loading: reportActive }] = useLazyQuery<{
    report: ITransaction[];
  }>(TRANSACTION_REPORT, {
    onCompleted: ({ report }) => {
      exportItems(report);
    }
  });

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const pickMonth = {
    years: [now.getFullYear(), now.getFullYear() - 1],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  };

  if (token === null || token === undefined) {
    history.push("/login");
  }

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error || !data) {
    history.push("/login");
    // return <p>Error: {error.message}</p>;
  }

  const requestReport = () => {
    callReport({
      variables: {
        merchantId: data && data.me.merchantId,
        date: new Date(year, month, 1).toISOString().slice(0, 10)
      }
    });
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        {data && data.me ? (
          <Fragment>
            <Typography className={classes.title} gutterBottom>
              Welcome, {data.me.firstName}!
            </Typography>
            <Typography>
              You are currently logged in as {data.me.email}
            </Typography>
          </Fragment>
        ) : (
          <Fragment>
            <Typography className={classes.title} gutterBottom>
              Welcome!
            </Typography>
            <Typography>You are not logged in..</Typography>
          </Fragment>
        )}
      </CardContent>
      <CardActions>
        {data && data.me ? (
          <Fragment>
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
            <Button
              size="small"
              onClick={requestReport}
              disabled={reportActive}
            >
              Export Report
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/login">
              <Button size="small">Login</Button>
            </Link>
          </Fragment>
        )}
      </CardActions>
    </Card>
  );
}
