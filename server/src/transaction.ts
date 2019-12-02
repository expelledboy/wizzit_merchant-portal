// type Transaction {
//   id: ID!
//   type: String
//   version: String
//   amount: Int
//   msisdn: String
//   merchantId: String
//   createdAt: String
//   authCode: String
//   respCode: String
//   status: String
//   trxId: String
// }

export const transform = (data: any) => {
  const { _id, trx_id, created_at, actions, status: trxStatus } = data;
  const trx = {};

  Object.assign(trx, {
    id: _id,
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
          context: { amount } = { amount: null }
        }
      } = detail;
      Object.assign(trx, {
        authCode: auth,
        amount,
        type: data.meta.type,
        version: data.meta.version
      });
    }
  };

  const transformKey = `${data.meta.type}:${data.meta.version}`;

  if (!transform[transformKey]) {
    console.warn("unhandled transaction type: " + transformKey);
    Object.assign(trx, { type: "Unknown" });
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
