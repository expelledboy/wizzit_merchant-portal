import * as Knex from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("cards").del();
  await knex("users").del();
  await knex("merchantUsers").del();
  await knex("merchants").del();

  const hashedPassword = await bcrypt.hash("~password~", 10);
  await knex("merchantUsers").insert([
    {
      email: "admin@wizzit-int.com",
      password: hashedPassword,
      firstName: "Admin",
      role: "Admin"
    }
  ]);
}
