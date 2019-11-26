import React, { useState } from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IUser, IMerchant } from "../types";
import { useEffect } from "react";
import { FormControl, Select, MenuItem } from "@material-ui/core";

export const LIST_USERS = gql`
  query users($page: Int, $pageSize: Int) {
    users(page: $page, pageSize: $pageSize) {
      total
      items {
        id
        email
        password
        firstName
        lastName
        merchantId
        merchant {
          id
          name
        }
        active
      }
    }
  }
`;

export const LIST_MERCHANTS = gql`
  query merchants($page: Int, $pageSize: Int) {
    merchants(page: $page, pageSize: $pageSize) {
      total
      items {
        id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $user: UpdateUserInput!) {
    updateUser(id: $id, user: $user)
  }
`;

export interface Pagination {
  page: number;
  pageSize: number;
}

function ViewMerchant(rowData: any) {
  return rowData.merchant ? <p>{rowData.merchant.name}</p> : <div>-</div>;
}

function SelectMerchant({ rowData, onChange }: any) {
  const merchants = useQuery<{
    merchants: {
      total: number;
      items: IMerchant[];
    };
  }>(LIST_MERCHANTS, {
    variables: { page: 1, pageSize: 100 },
    displayName: "UserSelectMerchant"
  });

  if (merchants.loading) {
    return <p>Loading...</p>;
  }

  const handleChange = (event: any) => {
    const merchantId = parseInt(event.target.value);
    onChange(merchantId);
  };

  return (
    <FormControl>
      <Select
        value={rowData.merchantId ? rowData.merchantId.toString() : ""}
        onChange={handleChange}
      >
        {merchants.data
          ? merchants.data.merchants.items.map(merchant => {
              return (
                <MenuItem key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </MenuItem>
              );
            })
          : "Loading"}
      </Select>
    </FormControl>
  );
}

export function Users() {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10
  });

  const columns: Array<Column<IUser>> = [
    { title: "Email", field: "email" },
    { title: "Name", field: "firstName" },
    { title: "Surname", field: "lastName" },
    {
      title: "Merchant",
      field: "merchantId",
      render: ViewMerchant,
      editComponent: SelectMerchant
    },
    { title: "Active", field: "active", type: "boolean" }
  ];

  const users = useQuery<{
    users: {
      total: number;
      items: IUser[];
    };
  }>(LIST_USERS, {
    variables: pagination,
    displayName: "Users"
  });

  const updatePage = (page: number) => {
    setPagination((data: Pagination) => ({ page, ...data }));
  };

  const updatePageSize = (pageSize: number) => {
    setPagination((data: Pagination) => ({ pageSize, ...data }));
  };

  useEffect(() => {
    users.refetch();
  }, [users, pagination]);

  const refetchQueries = [{ query: LIST_USERS, variables: pagination }];

  const [updateUser] = useMutation<void>(UPDATE_USER, {
    refetchQueries
  });

  const onRowUpdate = async (data: any, _prev: any | undefined) => {
    const { email, firstName, lastName, merchantId, active } = data;
    const user = { email, firstName, lastName, merchantId, active };

    try {
      await updateUser({ variables: { id: data.id, user } });
    } catch (error) {
      console.error("onRowUpdate", error);
    }
  };

  const editable = {
    onRowUpdate
  };

  if (users.error) {
    return <p>{users.error.message}</p>;
  }

  const props = {
    title: "Users",
    data: users.data ? users.data.users.items : [],
    // totalCount: users.data ? users.data.users.total : 0,
    isLoading: users.loading,
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
