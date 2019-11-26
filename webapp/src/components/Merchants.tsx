import React, { useState } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IMerchant } from "../types";
import { useEffect } from "react";

// https://github.com/magento/pwa-studio/blob/c78b4eae315789fa2a9b08696fe115661d0087d5/packages/peregrine/lib/talons/SearchPage/useSearchPage.js
// https://github.com/micetti/rickipedia/blob/master/src/queries/CharactersQuery.tsx
// https://github.com/SergeiMeza/airbnb-fullstack/blob/77f2f7e47cceb12e98db12b306b75b85c782b52e/packages/web/src/modules/users/UsersConnector.tsx

export const LIST_MERCHANTS = gql`
  query merchants($page: Int, $pageSize: Int) {
    merchants(page: $page, pageSize: $pageSize) {
      total
      items {
        id
        name
        merchantId
        merchantCode
        terminalId
        address
        active
      }
    }
  }
`;

export const DELETE_MERCHANT = gql`
  mutation deleteMerchant($id: ID!) {
    deleteMerchant(id: $id)
  }
`;

export const CREATE_MERCHANT = gql`
  mutation createMerchant($merchant: CreateMerchantInput!) {
    createMerchant(merchant: $merchant)
  }
`;

export const UPDATE_MERCHANT = gql`
  mutation updateMerchant($id: ID!, $merchant: UpdateMerchantInput!) {
    updateMerchant(id: $id, merchant: $merchant)
  }
`;

export interface Pagination {
  page: number;
  pageSize: number;
}

export function Merchants() {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10
  });

  const columns: Array<Column<IMerchant>> = [
    { title: "Name", field: "name" },
    { title: "Merchant Code", field: "merchantCode", editable: "onAdd" },
    { title: "Terminal Id", field: "terminalId", editable: "onAdd" },
    { title: "Address", field: "address" },
    { title: "Active", field: "active", type: "boolean" }
  ];

  const merchants = useQuery<{
    merchants: {
      total: number;
      items: IMerchant[];
    };
  }>(LIST_MERCHANTS, {
    variables: pagination,
    displayName: "Merchants"
  });

  const updatePage = (page: number) => {
    setPagination((data: Pagination) => ({ page, ...data }));
  };

  const updatePageSize = (pageSize: number) => {
    setPagination((data: Pagination) => ({ pageSize, ...data }));
  };

  useEffect(() => {
    merchants.refetch();
  }, [merchants, pagination]);

  const refetchQueries = [{ query: LIST_MERCHANTS, variables: pagination }];

  const [deleteMerchant] = useMutation<void>(DELETE_MERCHANT, {
    refetchQueries
  });
  const [saveMerchant] = useMutation<void>(CREATE_MERCHANT, {
    refetchQueries
  });
  const [updateMerchant] = useMutation<void>(UPDATE_MERCHANT, {
    refetchQueries
  });

  const onRowAdd = async (data: any) => {
    const merchant = data;

    try {
      await saveMerchant({ variables: { merchant } });
    } catch (error) {
      console.log("onRowAdd", error);
    }
  };

  const onRowUpdate = async (data: any, _prev: any | undefined) => {
    const { name, address, active } = data;
    const merchant = { name, address, active };

    try {
      await updateMerchant({ variables: { id: data.id, merchant } });
    } catch (error) {
      console.log("onRowUpdate", error);
    }
  };

  const onRowDelete = async (prev: IMerchant) => {
    try {
      await deleteMerchant({ variables: { id: prev.id } });
    } catch (error) {
      console.log("onRowDelete", error);
    }
  };

  const editable = {
    onRowAdd,
    onRowDelete,
    onRowUpdate
  };

  if (merchants.error) {
    return <p>{merchants.error.message}</p>;
  }

  const props = {
    title: "Merchants",
    data: merchants.data ? merchants.data.merchants.items : [],
    // totalCount: merchants.data ? merchants.data.merchants.total : 0,
    isLoading: merchants.loading,
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
