import knexStringcase from "knex-stringcase";

// const configFromKnexReadme = {
//   client: 'mysql',
//   connection: {
//     host : '127.0.0.1',
//     user : 'your_database_user',
//     password : 'your_database_password',
//     database : 'myapp_test'
//   }
// };

// const options = knexStringcase(configFromKnexReadme);
// const db = knex(options);

export const development = knexStringcase({
  client: "pg",
  connection: "postgres://wizzit_pay:wizzit_pay@docker:5432/wizzit_pay",
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
