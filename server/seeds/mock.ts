import * as Knex from "knex";
import * as bcrypt from "bcrypt";
import casual from "casual";
import { generateUnique } from "../../webapp/src/@utils/faker.js";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("transactions").del();
  await knex("cards").del();
  await knex("clients").del();
  await knex("users").del();
  await knex("merchants").del();

  const hashedPassword = await bcrypt.hash("12345", 10);
  await knex("users").insert([
    {
      email: "admin@wizzit.com",
      password: hashedPassword,
      firstName: "God",
      lastName: "Mode",
      role: "Admin",
      active: true
    }
  ]);

  const merchants = generateUnique(
    10,
    () => ({
      merchant_id: casual.uuid,
      name: casual.company_name,
      merchant_code: casual.numerify("#####"),
      password: "12345",
      terminal_id: casual.numerify("0##"),
      address: casual.address,
      active: casual.boolean
    }),
    (by: any) => by.merchant_id
  );
  await knex("merchants").insert(merchants);

  const merchantUsers = generateUnique(
    10,
    () => ({
      email: casual.email,
      password: hashedPassword,
      firstName: casual.first_name,
      lastName: casual.last_name,
      role: casual.random_element(["Admin", "MerchantUser"]),
      active: casual.boolean
    }),
    (by: any) => by.email
  );
  await knex("users").insert(merchantUsers);

  const clients = generateUnique(
    10,
    () => ({
      client_id: casual.uuid,
      active: casual.boolean,
      msisdn: casual.numerify("27#########")
    }),
    (by: any) => by.client_id
  );
  await knex("clients").insert(clients);

  const transactions = generateUnique(
    10,
    () => ({
      trx_guid: casual.uuid,
      trx_rrn: casual.numerify("############"),
      trx_stan: casual.numerify("###"),
      trx_datetime: new Date(casual.unix_time),
      trx_type: casual.numerify("0#00"),
      trx_amt: casual.integer(1, 10),
      trx_snd: {},
      trx_recv: {},
      trx_rsp_code: "00",
      trx_auth_code: "00000"
    }),
    (by: any) => by.trx_guid
  );
  await knex("transactions").insert(transactions);
}
