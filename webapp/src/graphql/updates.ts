import { IMerchantUser, IClient, IMerchant } from "../types.d";

const upsert = (array: any[], test: (value: any) => boolean, obj: any) => {
  const valuePos = array.findIndex(test);

  if (valuePos < 0) {
    array.push(obj);
  } else {
    Object.assign(array[valuePos], obj);
  }

  return array;
};

const upsertMerchantUser = ({ mutation, query }: any) => {
  const merchantUser = mutation.variables.merchantUser;
  const merchantUsers = upsert(
    query.result.merchantUsers,
    item => item.id === merchantUser.id,
    merchantUser
  );
  return {
    merchantUsers
  };
};

const deleteMerchantUser = ({ mutation, query }: any) => {
  const merchantUsers = query.result.merchantUsers.filter(
    (item: IMerchantUser) => item.id !== mutation.variables.id
  );
  return {
    merchantUsers
  };
};

const upsertMerchant = ({ mutation, query }: any) => {
  const merchant = mutation.variables.merchant;
  const merchants = upsert(
    query.result.merchants,
    item => item.merchantId === merchant.merchantId,
    merchant
  );
  return {
    merchants
  };
};

const deleteMerchant = ({ mutation, query }: any) => {
  const merchants = query.result.merchants.filter(
    (item: IMerchant) => item.merchantId !== mutation.variables.merchantId
  );
  return {
    merchants
  };
};

const upsertUser = ({ mutation, query }: any) => {
  const userUpdate = mutation.variables;
  const users = upsert(
    query.result.users,
    item => item.userId === userUpdate.userId,
    userUpdate
  );
  return {
    users
  };
};

const deleteUser = ({ mutation, query }: any) => {
  const users = query.result.users.filter(
    (item: IClient) => item.userId !== mutation.variables.userId
  );
  return {
    users
  };
};

export const updates = {
  saveMerchantUser: {
    merchantUsers: upsertMerchantUser
  },
  deleteMerchantUser: {
    merchantUsers: deleteMerchantUser
  },
  saveMerchant: {
    merchants: upsertMerchant
  },
  deleteMerchant: {
    merchants: deleteMerchant
  },
  setUserActive: {
    users: upsertUser
  },
  deleteUser: {
    users: deleteUser
  }
};
