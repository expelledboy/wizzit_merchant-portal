import React, { useState, useEffect } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IClient, IPagination } from "../types";
import { pick } from "ramda";

const tryCatchOn = (func: any, when: string) => (...args: any[]) => {
  try {
    return func(...args);
  } catch (e) {
    console.error("ERROR", when, e);
  }
};

export const LIST_CLIENTS = gql`
  query clients($page: Int, $pageSize: Int) {
    clients(page: $page, pageSize: $pageSize) {
      total
      page
      items {
        clientId
        msisdn
        active
      }
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation updateClient($clientId: ID!, $client: UpdateClientInput!) {
    updateClient(clientId: $clientId, client: $client)
  }
`;

export function Clients() {
  const [pagination, setPagination] = useState<IPagination>({
    // search: "",
    page: 0,
    pageSize: 10
  });

  const clients = useQuery<{
    clients: {
      total: number;
      page: number;
      items: IClient[];
    };
  }>(LIST_CLIENTS, {
    variables: pagination,
    displayName: "Clients"
  });

  const refetchQueries = [{ query: LIST_CLIENTS, variables: pagination }];
  const [updateClient] = useMutation<void>(UPDATE_CLIENT, { refetchQueries });

  const columns: Array<Column<IClient>> = [
    { title: "Mobile Number", field: "msisdn", editable: "never" },
    { title: "Active", field: "active", type: "boolean" }
  ];

  const editable = {
    onRowUpdate: tryCatchOn(async (client: IClient) => {
      const updates = pick(["active"], client);
      await updateClient({
        variables: { clientId: client.clientId, client: updates }
      });
    }, "onRowUpdate")
  };

  const updatePage = async (page: number) => {
    setPagination((data: IPagination) => ({ ...data, page }));
  };

  const updatePageSize = async (pageSize: number) => {
    setPagination((data: IPagination) => ({ ...data, page: 0, pageSize }));
  };

  useEffect(() => {
    clients.refetch({ variables: { pagination } });
  }, [pagination, clients]);

  if (clients.error) {
    return <p>{clients.error.message}</p>;
  }

  const props = {
    title: "Clients",
    columns,
    onChangePage: updatePage,
    onChangeRowsPerPage: updatePageSize,
    isLoading: clients.loading,
    data: clients.data ? clients.data.clients.items : [],
    totalCount: clients.data && clients.data.clients.total,
    page: pagination.page,
    editable,
    options: {
      // TODO: Until we implement paginated searches disable this for now.
      search: false,
      pageSize: pagination.pageSize,
      debounceInterval: 600
    }
  };

  return (
    <div style={{ color: "white" }}>
      <MaterialTable {...props} />
    </div>
  );
}
