import express from "express";
import bcrypt from "bcrypt";
import { MerchantUser } from "./constants";
import { createToken } from "./permissions";

const signup = async (_parent: any, { merchant }, { db }) => {
  const password = await bcrypt.hash(merchant.password, 10);

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

const login = async (_parent: any, { email, password }, { db }) => {
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

const me = async (_parent: any, _args, { db, userId }) => {
  return await db("merchantUsers")
    .where({ id: userId })
    .first();
};

const aken = async (_parent: any, { merchantCode, password }, { db }) => {
  const merchant = await db("merchants")
    .where({ merchantCode })
    .first();

  console.log(merchant);

  if (!!merchant && merchant.password === password) return true;

  return false;
};

const merchants = async (_parent: any, _args, { db }) => {
  return await db("merchants");
};

const saveMerchant = async (_parent: any, { merchants }, { db }) => {
  return await db("merchants")
    .where({ merchantId: merchants.merchantId })
    .update(merchants);
};

const deleteMerchant = async (_parent: any, { merchantId }, { db }) => {
  await db("merchants")
    .where({ merchantId })
    .del();
  return true;
};

const merchantUsers = async (_parent: any, _args, { db }) => {
  return await db("merchantUsers");
};

const saveMerchantUser = async (_parent: any, { merchantUser }, { db }) => {
  return await db("merchantUsers")
    .where({ id: merchantUser.id })
    .update(merchantUser);
};

const deleteMerchantUser = async (_parent: any, { id }, { db }) => {
  await db("merchantUsers")
    .where({ id })
    .del();
  return true;
};

const users = async (_parent: any, _args, { db }) => {
  return await db("users");
};

const setUserActive = async (_parent: any, { userId, active }, { db }) => {
  return await db("users")
    .where({ userId })
    .update({ active });
};

const transactions = async (_parent: any, _args, { db }) => {
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
    aken,
    signup,
    saveMerchantUser,
    deleteMerchantUser,
    saveMerchant,
    deleteMerchant,
    setUserActive
  }
};
