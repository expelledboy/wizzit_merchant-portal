export const transform = (data: any) => {
  const { _id, trx_id, status, meta, actions, created_at } = data;

  const trx = {
    id: _id,
    trxId: trx_id,
    createdAt: created_at,
    status,
    merchantId: meta.merchant_id || "Unknown",
    type: meta.type || "Unknown",
    version: meta.version
  };

  const transform = {
    "scc:1.0": () => {
      Object.assign(trx, {
        refId: actions[0].params.payload.ref_id
      });
    },
    "pay:1.0": () => {
      Object.assign(trx, {
        msisdn: actions[0].params.msisdn,
        respCode: actions[3].context.payload.response_code.status,
        authCode: actions[3].context.payload.response_code.auth,
        amount: actions[1].params.amount
      });
    },
    "link_card:1.0": () => {
      Object.assign(trx, {
        msisdn: actions[0].params.msisdn,
        respCode: actions[3].context.payload.response_code.status,
        authCode: actions[3].context.payload.response_code.auth,
        amount: actions[1].params.amount
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
