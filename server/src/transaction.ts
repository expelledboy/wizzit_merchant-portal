export const transform = (data: any) => {
  const { trx_id, created_at, actions, status: trxStatus } = data;
  const trx = {};

  Object.assign(trx, {
    trxId: trx_id,
    createdAt: created_at,
    status: trxStatus
  });

  const detail = actions.reduce((acc: any, action: any) => {
    Object.assign(acc, { [action.name]: action });
    return acc;
  }, {});

  const transform = {
    "secure_card_capture:1.0": () => {
      const {
        pay: {
          result: { auth } = { auth: null },
          context: { amount, tx_type } = { amount: null, tx_type: null }
        }
      } = detail;
      Object.assign(trx, {
        auth: auth,
        amount,
        type: tx_type
      });
    }
  };

  const transformKey = `${data.meta.type}:${data.meta.version}`;

  if (!transform[transformKey]) {
    console.warn("unhandled transaction type: " + transformKey);
    return trx;
  }

  try {
    transform[transformKey]();
    return trx;
  } catch (err) {
    console.error(err);
    return trx;
  }
};
