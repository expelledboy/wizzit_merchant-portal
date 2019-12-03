import bcrypt from "bcrypt";
import { MerchantUser } from "./constants";
import { createToken } from "./permissions";
import uuid from "uuid/v4";
import { transform } from "./transaction";

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

const clients = async (_parent: any, { page, pageSize }, { db }) => {
  const { data: clients, pagination } = await db("clients").paginate({
    perPage: pageSize,
    currentPage: page,
    isLengthAware: true
  });

  console.log({ clients, pagination });

  return {
    items: clients,
    ...pagination
  };
};

const updateClient = async (_parent: any, { clientId, client }, { db }) => {
  return await db("clients")
    .where({ clientId })
    .update(client);
};

const transactions = async (
  _parent: any,
  { next, limit = 10 }: any,
  { merchantId, txEngine }: any
) => {
  const request = {
    query: {
      ...(merchantId && { merchant_id: merchantId })
    },
    limit,
    ...(next && { next })
  };

  return txEngine.post("/query", request).then((response: any) => {
    const { items: transactions, next, hasNext } = response.data;
    return {
      next,
      haveMore: hasNext,
      items: transactions.map(transform).filter((trx: any) => trx !== null)
    };
  });
};

const report = async (
  _parent: any,
  { date }: any,
  { merchantId, txEngine }: any
) => {
  const request = {
    query: {
      ...(merchantId && { merchant_id: merchantId })
    },
    ...(date && { date })
  };

  return txEngine.post("/report", request).then((transactions: any) => {
    return transactions.data.map(transform).filter((trx: any) => trx !== null);
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
    transactions,
    report
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
