import express from "express";
import bcrypt from "bcrypt";
import { MerchantUser } from "./constants";
import { createToken } from "./permissions";

const signup = async (parent, { merchant }, { db }) => {
  const password = await bcrypt.hash(merchant.password, 10);
  let user;

  try {
    const user = await db("merchantUsers").insert({
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

const login = async (parent, { email, password }, { db }) => {
  const user = await db("merchantUsers")
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
      role: user.role
    })
  };
};

const me = async (parent, _args, { db, userId }) => {
  console.log("HERE");
  return await db("merchantUsers")
    .where({ id: userId })
    .first();
};

const merchants = async (parent, _args, { db }) => {
  return await db("merchants");
};

const saveMerchant = async (parent, { merchants }, { db }) => {
  return await db("merchants")
    .where({ merchantId: merchants.merchantId })
    .update(merchants);
};

const deleteMerchant = async (parent, { merchantId }, { db }) => {
  await db("merchants")
    .where({ merchantId })
    .del();
  return true;
};

const merchantUsers = async (parent, _args, { db }) => {
  return await db("merchantUsers");
};

const saveMerchantUser = async (parent, { merchantUser }, { db }) => {
  return await db("merchantUsers")
    .where({ id: merchantUser.id })
    .update(merchantUser);
};

const deleteMerchantUser = async (parent, { id }, { db }) => {
  await db("merchantUsers")
    .where({ id })
    .del();
  return true;
};

const users = async (parent, _args, { db }) => {
  return await db("users");
};

const setUserActive = async (parent, { userId, active }, { db }) => {
  return await db("users")
    .where({ userId })
    .update({ active });
};

const transactions = async (parent, _args, { db }) => {
  return await db("transactions").select(
    "trx_guid as uuid",
    "trx_rrn as rrn",
    "trx_stan as stan",
    "trx_datetime as datetime",
    "trx_type as type",
    "trx_amt as amt",
    "trx_rsp_code as respCode",
    "trx_auth_code as authCode"
  );
};

export const resolvers = {
  Query: {
    me,
    merchants,
    merchantUsers,
    users,
    transactions
  },
  Mutation: {
    login,
    signup,
    saveMerchantUser,
    deleteMerchantUser,
    saveMerchant,
    deleteMerchant,
    setUserActive
  }
};
