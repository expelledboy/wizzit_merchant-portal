import React from "react";
import MaterialTable, { Column } from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { IUser, IMerchant } from "../types";
import { FormControl, Select, MenuItem } from "@material-ui/core";

export const LIST_USERS = gql`
  query users {
    users {
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
          merchantId
          name
        }
        active
      }
    }
  }
`;

export const LIST_MERCHANTS = gql`
  query merchants {
    merchants {
      total
      items {
        merchantId
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
    displayName: "UserSelectMerchant"
  });

  if (merchants.loading) {
    return <p>Loading...</p>;
  }

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl>
      <Select value={rowData.merchantId || ""} onChange={handleChange}>
        {merchants.data
          ? merchants.data.merchants.items.map(merchant => {
              return (
                <MenuItem key={merchant.merchantId} value={merchant.merchantId}>
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
    displayName: "Users"
  });

  const refetchQueries = [{ query: LIST_USERS }];

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
    totalCount: users.data ? users.data.users.total : 0,
    isLoading: users.loading,
    columns,
    editable
  };

  return (
    <div style={{ color: "white" }}>
      <MaterialTable {...props} />
    </div>
  );
}
