import knexStringcase from "knex-stringcase";

export const development = knexStringcase({
  client: "pg",
  connection: process.env.DATABASE_URL || "postgres://wizzit_pay:wizzit_pay@docker:5432/wizzit_pay",
  migrations: {
    tableName: "knex_migrations"
  },
  useNullAsDefault: true
});

export const production = knexStringcase({
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations"
  },
  useNullAsDefault: true
});
