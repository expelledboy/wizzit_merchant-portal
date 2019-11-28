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

  useEffect(() => {
    clients.refetch();
  }, [clients, pagination]);

  const refetchQueries = [{ query: LIST_CLIENTS, variables: pagination }];

  const [updateClient] = useMutation<void>(UPDATE_CLIENT, {
    refetchQueries
  });

  const onRowUpdate = async (data: any, _prev: any | undefined) => {
    const { active } = data;
    const client = { active };

    try {
      await updateClient({ variables: { id: data.clientId, client } });
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

  const props = {
    title: "Clients",
    data: clients.data ? clients.data.clients.items : [],
    // totalCount: clients.data ? clients.data.clients.total : 0,
    isLoading: clients.loading,
    onChangePage: updatePage,
    onChangeRowsPerPage: updatePageSize,
    columns,
    editable,
    ...pagination
  };

  return (
    <div style={{ color: "white" }}>
      <MaterialTable {...props} />
    </div>
  );
}
