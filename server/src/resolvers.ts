import express from "express";
import bcrypt from "bcrypt";
import { MerchantUser } from "./constants";
import { createToken } from "./permissions";

// const salt = "~salty~";

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
  return await db("merchantUsers")
    .where({ id: userId })
    .first();
};

const merchants = async (parent, _args, { db }) => {
  return await db("merchants");
};

const merchantUsers = async (parent, _args, { db }) => {
  return await db("merchantUsers");
};

export const resolvers = {
  Query: {
    me,
    merchants,
    merchantUsers
  },
  Mutation: {
    login,
    signup
  }
};
