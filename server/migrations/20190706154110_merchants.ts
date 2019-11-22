import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("merchants", table => {
    table.increments();

    table.uuid("merchant_id").index();
    table.string("password");

    table.string("name");
    table.string("merchant_code");
    table.string("terminal_id");
    table.string("address");

    table.boolean("active");

    table.unique(["merchant_id"]);
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("merchants");
}
