import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("transactions", table => {
    table.uuid("trx_guid").primary();
    table.string("trx_rrn");
    table.string("trx_stan");
    table.dateTime("trx_datetime");
    table.string("trx_type");
    table.integer("trx_amt");
    table.json("trx_snd");
    table.json("trx_recv");
    table.string("trx_rsp_code");
    table.string("trx_auth_code");
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("transactions");
}
