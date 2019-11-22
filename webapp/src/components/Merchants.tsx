import React, { useState } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IMerchant } from "../types";
import { useEffect } from "react";
import { tryStatement } from "@babel/types";
import { tryFunctionOrLogError } from "apollo-utilities";

// https://github.com/magento/pwa-studio/blob/c78b4eae315789fa2a9b08696fe115661d0087d5/packages/peregrine/lib/talons/SearchPage/useSearchPage.js
// https://github.com/micetti/rickipedia/blob/master/src/queries/CharactersQuery.tsx
// https://github.com/SergeiMeza/airbnb-fullstack/blob/77f2f7e47cceb12e98db12b306b75b85c782b52e/packages/web/src/modules/users/UsersConnector.tsx

export const LIST_MERCHANTS = gql`
  query merchants($page: Int, $pageSize: Int) {
    merchants(page: $page, pageSize: $pageSize) {
      total
      items {
        merchantId
        name
        merchantCode
        terminalId
        address
        active
      }
    }
  }
`;

export const DELETE_MERCHANT = gql`
  mutation deleteMerchant($merchantId: ID!) {
    deleteMerchant(merchantId: $merchantId)
  }
`;

export const SAVE_MERCHANT = gql`
  mutation saveMerchant($merchant: MerchantInput!) {
    saveMerchant(merchant: $merchant)
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
    { title: "Merchant Code", field: "merchantCode" },
    { title: "Terminal Id", field: "terminalId" },
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
  }, [pagination]);

  const [deleteMerchant] = useMutation<void>(DELETE_MERCHANT);
  const [saveMerchant] = useMutation<void>(SAVE_MERCHANT);

  const onRowAdd = async (data: IMerchant) => {
    try {
      await saveMerchant({ variables: { merchant: data } });
    } catch (error) {
      console.log(error);
    }
  };

  const onRowUpdate = async (data: IMerchant, _prev: IMerchant | undefined) => {
    await saveMerchant({ variables: { merchant: data } });
    await merchants.refetch();
  };

  const onRowDelete = async (prev: IMerchant) => {
    await deleteMerchant({ variables: { merchantId: prev.merchantId } });
    await merchants.refetch();
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
