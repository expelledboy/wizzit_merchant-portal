export const JWT_SECRET = process.env.PRISMA_AUTH_SECRET || "(▀̿̿Ĺ̯̿▀̿ ̿)";

export const Admin = Symbol.for("Admin");
export const MerchantUser = Symbol.for("MerchantUser");

export type Role = typeof Admin | typeof MerchantUser;
