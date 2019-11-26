import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("cards", table => {
    table.increments();
    table.string("card_number").index();
    table.uuid("user_id").references("clients.client_id");
    table.boolean("active");
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("users");
}
