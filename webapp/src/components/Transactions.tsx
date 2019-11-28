import React, { useState } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ITransaction } from "../types";
import { useEffect } from "react";

export const LIST_TRANSACTIONS = gql`
  query transactions($page: Int, $pageSize: Int) {
    transactions(page: $page, pageSize: $pageSize) {
      total
      items {
        uuid
        amount
        # rrn
        # stan
        datetime
        type
        # amt
        respCode
        authCode
      }
    }
  }
`;

export interface Pagination {
  page: number;
  pageSize: number;
}

export function Transactions() {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 100
  });

  const columns: Array<Column<ITransaction>> = [
    { title: "UUID", field: "uuid" },
    // { title: "RRN", field: "rrn" },
    // { title: "STAN", field: "stan" },
    { title: "DateTime", field: "datetime" },
    { title: "Type", field: "type" },
    // { title: "AMT", field: "amt" },
    { title: "Response", field: "respCode" },
    { title: "Auth Code", field: "authCode" }
  ];

  const transactions = useQuery<{
    transactions: {
      total: number;
      items: ITransaction[];
    };
  }>(LIST_TRANSACTIONS, {
    variables: pagination,
    displayName: "Transactions"
  });

  const updatePage = (page: number) => {
    setPagination((data: Pagination) => ({ page, ...data }));
  };

  const updatePageSize = (pageSize: number) => {
    setPagination((data: Pagination) => ({ pageSize, ...data }));
  };

  useEffect(() => {
    transactions.refetch();
  }, [transactions, pagination]);

  if (transactions.error) {
    return <p>{transactions.error.message}</p>;
  }

  const props = {
    title: "Transactions",
    data: transactions.data ? transactions.data.transactions.items : [],
    // totalCount: transactions.data ? transactions.data.transactions.total : 0,
    isLoading: transactions.loading,
    onChangePage: updatePage,
    onChangeRowsPerPage: updatePageSize,
    columns,
    options: { exportButton: true },
    ...pagination
  };

  return (
    <div style={{ color: "white" }}>
      <MaterialTable {...props} />
    </div>
  );
}
