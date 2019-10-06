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
  return {
    ...query.result,
    merchantUsers: {
      ...query.result.merchantUsers,
      items: upsert(
        query.result.merchantUsers.items,
        item => item.id === mutation.variables.id,
        mutation.result.data.merchantUser
      )
    }
  };
};

export const updates = {
  SAVE_MERCHANT_USER: {
    MERCHANT_USERS: upsertMerchantUser
  }
};
