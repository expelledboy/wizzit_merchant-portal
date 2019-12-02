import * as Knex from "knex";
import { onUpdateTrigger } from "../knexfile";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("merchants", table => {
    table.increments();
    table.string("name");
    table.string("terminal_id");
    table.uuid("merchant_id").index();
    table.string("merchant_code");
    table.string("address");
    table.string("password");
    table.boolean("active");
    table.unique(["merchant_id"]);
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("merchants"));
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("merchants");
}
