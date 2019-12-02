import * as Knex from "knex";
import { onUpdateTrigger } from "../knexfile";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("users", table => {
    table.increments();
    table.string("email").index();
    table.string("password");
    table.string("first_name");
    table.string("last_name");
    table.uuid("merchant_id").references("merchants.merchant_id");
    table.enu("role", ["Admin", "MerchantUser"]).defaultTo("MerchantUser");
    table.boolean("active").defaultTo(false);
    table.unique(["email"]);
    table.timestamps(true, true);
  });

  await knex.schema.table("merchants", table => {
    table
      .integer("contact_id")
      .unsigned()
      .references("users.id");
  });

  await knex.raw(onUpdateTrigger("users"));
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("users");

  await knex.schema.table("merchants", table => {
    table.dropColumn("contact_id");
  });
}
