import { rule, shield, and, or, not } from "graphql-shield";
import * as jwt from "jsonwebtoken";
import { Role, Admin, JWT_SECRET } from "./constants";

// Auth

export interface Token {
  userId: string;
  roles: string[];
  merchant_id: string | undefined;
}

export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE || 60 * 60 * 24 * 5
  });
}

export function getTokenPayload(authorization: any) {
  let token: any;
  try {
    token = jwt.verify(authorization, JWT_SECRET) as Token;
  } catch (e) {
    return null;
  }
  return token;
}

// Rules

const isAuthenticated = rule()(async (_parent, _args, ctx, _info) => {
  return !!ctx.userId;
});

const isRole = (role: Role) =>
  rule()(async (_parent, _args, ctx, _info) => {
    return ctx.role && ctx.role === Symbol.keyFor(role);
  });

// const isPostOwner = rule()(async (parent, args, ctx, info) => {
//   const author = await ctx.prisma.posts
//     .findOne({
//       where: {
//         id: args.id
//       }
//     })
//     .author();
//   return ctx.userId === author.id;
// });

// Permissions

export const permissions = shield({
  Query: {
    me: isAuthenticated,
    merchants: and(isAuthenticated, isRole(Admin)),
    users: and(isAuthenticated, isRole(Admin)),
    clients: and(isAuthenticated, isRole(Admin))
  }
});
