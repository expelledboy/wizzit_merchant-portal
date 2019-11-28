import bcrypt from "bcrypt";
import { MerchantUser } from "./constants";
import { createToken } from "./permissions";
import uuid from "uuid/v4";

const signup = async (_parent: any, { merchant }, { db }) => {
  const password = await bcrypt.hash(merchant.password, 10);

  try {
    const user = await db("users").insert({
      ...merchant,
      password,
      role: Symbol.keyFor(MerchantUser)
    });

    return {
      token: createToken({
        userId: user.id,
        role: user.role
      })
    };
  } catch (e) {
    if (e.constraint === "merchant_users_email_unique") {
      return login(parent, merchant, { db });
    }

    return {
      error: "Failed to create profile"
    };
  }
};

const login = async (_parent: any, { email, password }, { db }) => {
  const user = await db("users")
    .where({ email })
    .first();

  if (!user) {
    return {
      error: "Failed to authenticate"
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      error: "Failed to authenticate"
    };
  }

  return {
    token: createToken({
      userId: user.id,
      role: user.role,
      merchantId: user.merchantId
    })
  };
};

const me = async (_parent: any, _args: any, { db, userId }) => {
  return await db("users")
    .where({ id: userId })
    .first();
};

const aken = async (_parent: any, { merchantId, password }, { db }) => {
  const merchant = await db("merchants")
    .where({ merchantId })
    .first();

  if (!!merchant && merchant.password === password) {
    const { merchantCode, name } = merchant;
    return {
      authenticated: true,
      merchantCode,
      name
    };
  }

  return {
    authenticated: false
  };
};

const merchants = async (_parent: any, _args: any, { db }) => {
  const merchants = await db("merchants");
  return {
    total: merchants.length,
    items: merchants
  };
};

const createMerchant = async (_parent: any, { merchant }, { db }) => {
  Object.assign(merchant, {
    merchantId: uuid(),
    password: uuid()
  });
  return await db("merchants").insert(merchant);
};

const updateMerchant = async (_parent: any, { id, merchant }, { db }) => {
  return await db("merchants")
    .where({ id })
    .update(merchant);
};

const deleteMerchant = async (_parent: any, { id }, { db }) => {
  await db("merchants")
    .where({ id })
    .del();
  return true;
};

const users = async (_parent: any, _args: any, { db }) => {
  const users = await db("users");
  return {
    total: users.length,
    items: users
  };
};

const merchant = async (user: any, _args: any, { db }) => {
  if (!user.merchantId) return null;
  return await db("merchants")
    .where({ merchantId: user.merchantId })
    .first();
};

const updateUser = async (_parent: any, { id, user }, { db }) => {
  return await db("users")
    .where({ id })
    .update(user);
};

const clients = async (_parent: any, _args: any, { db }) => {
  const clients = await db("clients");
  return {
    total: clients.length,
    items: clients
  };
};

const updateClient = async (_parent: any, { clientId, client }, { db }) => {
  return await db("clients")
    .where({ clientId })
    .update(client);
};

// {
//   "status": "completed",
//   "_id": "5ddd2b6ba2b0d90013b63376",
//   "trx_id": "61299820-1052-11ea-a557-77dd25631a0f",
//   "meta": {
//     "merchant_id": "446db458-0d2f-11ea-8d71-362b9e155667"
//   },
//   "actions": [
//     {
//       "status": "completed",
//       "_id": "5ddd2b6ba2b0d90013b6337a",
//       "name": "fetch_pending_user",
//       "params": {
//         "msisdn": "27662073765"
//       },
//       "created_at": "2019-11-26T13:40:59.185Z",
//       "updated_at": "2019-11-26T13:40:59.204Z",
//       "context": {
//         "msisdn": "27662073765"
//       },
//       "result": "1811080651676323800"
//     },
//     {
//       "status": "completed",
//       "_id": "5ddd2b6ba2b0d90013b63379",
//       "name": "pay",
//       "params": {
//         "_user_id": "_.fetch_pending_user[0]",
//         "token": "F3A5BF3163E8956F33765BC81DE049CBB72967CBA1530105FB736FEDCD08CCA6",
//         "ucavv": "",
//         "xid": "",
//         "pin": "aea03154397dbcfc091f15e2aac4e4c9",
//         "expYear": "22",
//         "expMonth": "11",
//         "amount": 100,
//         "tx_type": "AMT",
//         "acc_type": "10",
//         "merchant_code": "73782341",
//         "merchant_name": "Paym8"
//       },
//       "created_at": "2019-11-26T13:40:59.186Z",
//       "updated_at": "2019-11-26T13:40:59.474Z",
//       "context": {
//         "user_id": "1811080651676323800",
//         "token": "F3A5BF3163E8956F33765BC81DE049CBB72967CBA1530105FB736FEDCD08CCA6",
//         "ucavv": "",
//         "xid": "",
//         "pin": "aea03154397dbcfc091f15e2aac4e4c9",
//         "expYear": "22",
//         "expMonth": "11",
//         "amount": 100,
//         "tx_type": "AMT",
//         "acc_type": "10",
//         "merchant_code": "73782341",
//         "merchant_name": "Paym8"
//       },
//       "result": {
//         "auth": "309693",
//         "status": "00"
//       }
//     },
//     {
//       "status": "completed",
//       "_id": "5ddd2b6ba2b0d90013b63378",
//       "name": "confirm_pending_user",
//       "params": {
//         "_user_id": "_.fetch_pending_user[0]",
//         "msisdn": "27662073765"
//       },
//       "created_at": "2019-11-26T13:40:59.186Z",
//       "updated_at": "2019-11-26T13:40:59.487Z",
//       "context": {
//         "user_id": "1811080651676323800",
//         "msisdn": "27662073765"
//       }
//     },
//     {
//       "status": "completed",
//       "_id": "5ddd2b6ba2b0d90013b63377",
//       "name": "callback",
//       "params": {
//         "callback_url": "http://197.231.175.43:8082/api/callback",
//         "payload": {
//           "ref_id": "AMTT0010",
//           "msisdn": "27662073765",
//           "amount": 100,
//           "_response_code": "_.pay[0]"
//         }
//       },
//       "created_at": "2019-11-26T13:40:59.186Z",
//       "updated_at": "2019-11-26T13:40:59.511Z",
//       "context": {
//         "callback_url": "http://197.231.175.43:8082/api/callback",
//         "payload": {
//           "ref_id": "AMTT0010",
//           "msisdn": "27662073765",
//           "amount": 100,
//           "response_code": {
//             "auth": "309693",
//             "status": "00"
//           }
//         }
//       }
//     }
//   ],
//   "created_at": "2019-11-26T13:40:59.186Z",
//   "updated_at": "2019-11-26T13:40:59.517Z",
//   "__v": 0
// },

const flattenTransaction = (data: any) => {
  try {
    const { trx_id, actions, created_at } = data;

    const {
      pay: {
        result: { auth, status } = { auth: null, status: null },
        context: { amount, tx_type } = { amount: null, tx_type: null }
      }
    } = actions.reduce((acc: any, action: any) => {
      Object.assign(acc, { [action.name]: action });
      return acc;
    }, {});

    return {
      uuid: trx_id,
      amount,
      // rrn: String!
      // stan: String!
      datetime: created_at,
      type: tx_type,
      // amt: Int!
      respCode: status,
      authCode: auth
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const transactions = async (
  _parent: any,
  { page, pageSize }: any,
  { merchantId, txEngine }: any
) => {
  console.log({ merchantId });
  return txEngine
    .post("/", {
      merchant_id: merchantId,
      page,
      pageSize
    })
    .then(({ data: transactions }: any) => {
      console.log(transactions);
      return {
        total: 0,
        items: transactions
          .map(flattenTransaction)
          .filter((trx: any) => trx !== null)
      };
    });
};

export const resolvers = {
  User: {
    merchant
  },
  Query: {
    me,
    merchants,
    users,
    clients,
    transactions
  },
  Mutation: {
    login,
    aken,
    signup,

    createMerchant,
    updateMerchant,
    deleteMerchant,

    updateUser,

    updateClient
  }
};
