import { IMerchantUser } from "../types.d";

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
  console.log({ merchantUsers, query, mutation });
  return {
    merchantUsers
  };
};

export const updates = {
  saveMerchantUser: {
    merchantUsers: upsertMerchantUser
  },
  deleteMerchantUser: {
    merchantUsers: deleteMerchantUser
  }
};
