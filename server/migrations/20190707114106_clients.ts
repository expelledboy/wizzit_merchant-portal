import * as Knex from "knex";
import { onUpdateTrigger } from "../knexfile";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("clients", table => {
    table.uuid("client_id").primary();
    table.string("msisdn").index();
    table.boolean("active");
    table.unique(["msisdn"]);
    table.timestamps(true, true);
  });

  await knex.raw(onUpdateTrigger("clients"));
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("clients");
}
