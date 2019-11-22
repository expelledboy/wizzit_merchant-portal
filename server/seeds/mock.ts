import * as Knex from "knex";
import * as bcrypt from "bcrypt";
import casual from "casual";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("cards").del();
  await knex("users").del();
  await knex("merchantUsers").del();
  await knex("merchants").del();
  await knex("transactions").del();

  const hashedPassword = await bcrypt.hash("12345", 10);
  await knex("merchantUsers").insert([
    {
      email: "admin@wizzit.com",
      password: hashedPassword,
      firstName: "God",
      lastName: "Mode",
      role: "Admin",
      active: true
    }
  ]);

  const merchants = [...Array(10)].map(() => ({
    merchant_id: casual.uuid,
    name: casual.company_name,
    merchant_code: casual.numerify("#####"),
    password: "12345",
    terminal_id: casual.numerify("0##"),
    address: casual.address,
    active: casual.boolean
  }));
  await knex("merchants").insert(merchants);

  const merchantUsers = [...Array(10)].map(() => ({
    email: casual.email,
    password: hashedPassword,
    firstName: casual.first_name,
    lastName: casual.last_name,
    role: casual.random_element(["Admin", "MerchantUser"]),
    active: casual.boolean
  }));
  await knex("merchant_users").insert(merchantUsers);

  const users = [...Array(10)].map(() => ({
    user_id: casual.uuid,
    active: casual.boolean,
    msisdn: casual.numerify("27#########")
  }));
  await knex("users").insert(users);

  const transactions = [...Array(10)].map(() => ({
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
  }));
  await knex("transactions").insert(transactions);
}
