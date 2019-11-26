import { IMerchant } from "../types.d";
import casual from "casual-browserify";

const upsert = (array: any[], test: (value: any) => boolean, obj: any) => {
  const valuePos = array.findIndex(test);

  if (valuePos < 0) {
    array.push(obj);
  } else {
    Object.assign(array[valuePos], obj);
  }

  return array;
};

const upsertMerchant = ({ mutation, query }: any) => {
  if (!mutation.variables.merchant.__typename) {
    Object.assign(mutation.variables.merchant, {
      __typename: "Merchant",
      id: casual.integer(100, 200),
      merchantId: casual.uuid,
      active: false,
      ...mutation.variables.merchant
    });
  }

  const merchants = upsert(
    query.result.merchants.items,
    item => item.id === mutation.variables.id,
    mutation.variables.merchant
  );

  return {
    merchants: {
      ...query.result.merchants,
      total: merchants.length,
      items: merchants
    }
  };
};

const deleteMerchant = ({ mutation, query }: any) => {
  const merchants = query.result.merchants.items.filter(
    (item: IMerchant) => item.id !== mutation.variables.id
  );

  return {
    merchants: {
      ...query.result.merchants,
      total: merchants.length,
      items: merchants
    }
  };
};

const upsertUser = ({ mutation, query }: any) => {
  if (!mutation.variables.user.__typename) {
    Object.assign(mutation.variables.user, {
      __typename: "User",
      id: casual.integer(100, 200),
      active: false,
      ...mutation.variables.user
    });
  }

  const users = upsert(
    query.result.users.items,
    item => item.id === mutation.variables.id,
    mutation.variables.user
  );

  return {
    users: {
      ...query.result.users,
      total: users.length,
      items: users
    }
  };
};

const upsertClient = ({ mutation, query }: any) => {
  const clients = upsert(
    query.result.clients.items,
    item => item.clientId === mutation.variables.clientId,
    mutation.variables.client
  );

  return {
    clients: {
      ...query.result.clients,
      total: clients.length,
      items: clients
    }
  };
};

export const updates = {
  createMerchant: {
    merchants: upsertMerchant
  },
  updateMerchant: {
    merchants: upsertMerchant
  },
  deleteMerchant: {
    merchants: deleteMerchant
  },
  updateUser: {
    users: upsertUser
  },
  updateClient: {
    clients: upsertClient
  }
};
