import React, { useState } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useEffect } from "react";
import { IClient, IPagination } from "../types";

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
    page: 1,
    pageSize: 10
  });

  const columns: Array<Column<IClient>> = [
    { title: "Mobile Number", field: "msisdn", editable: "never" },
    { title: "Active", field: "active", type: "boolean" }
  ];

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

  const updatePage = (page: number) => {
    setPagination((data: IPagination) => ({ page, ...data }));
  };

  const updatePageSize = (pageSize: number) => {
    setPagination((data: IPagination) => ({ pageSize, ...data }));
  };

  const refetchQueries = [{ query: LIST_CLIENTS, variables: pagination }];

  const [updateClient] = useMutation<void>(UPDATE_CLIENT, {
    refetchQueries
  });

  const onRowUpdate = async (data: any, _prev: any | undefined) => {
    const { active } = data;
    const client = { active };

    try {
      await updateClient({ variables: { clientId: data.clientId, client } });
    } catch (error) {
      console.log("onRowUpdate", error);
    }
  };

  const editable = {
    onRowUpdate
  };

  if (clients.error) {
    return <p>{clients.error.message}</p>;
  }

  const loadData = async () => {
    await clients.refetch();

    const { items, total, page } = !!clients.data
      ? clients.data.clients
      : {
          items: [],
          total: 0,
          page: 0
        };

    console.log({ items, total, page, clients });

    return {
      data: items,
      totalCount: total,
      page
    };
  };

  const props = {
    title: "Clients",
    columns,
    data: loadData,
    isLoading: clients.loading,
    onChangePage: updatePage,
    onChangeRowsPerPage: updatePageSize,
    editable,
    options: {
      // TODO: Until we implement paginated searches disable this for now.
      search: false,
      ...pagination
    }
  };

  return (
    <div style={{ color: "white" }}>
      <MaterialTable {...props} />
    </div>
  );
}
