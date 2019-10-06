import * as Knex from "knex";
import * as bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  await knex("cards").del();
  await knex("users").del();
  await knex("merchantUsers").del();
  await knex("merchants").del();
  await knex("transactions").del();

  const hashedPassword = await bcrypt.hash("~password~", 10);
  await knex("merchantUsers").insert([
    {
      email: "admin@wizzit-int.com",
      password: hashedPassword,
      firstName: "Admin",
      role: "Admin",
      active: true
    }
  ]);

  await knex("transactions").insert([
    {
      trx_guid: "00111f89-9e63-11e9-b6e0-0242ac130004",
      trx_rrn: "888599782051",
      trx_stan: "611",
      trx_datetime: new Date("2019-07-04 13:52:45"),
      trx_type: "0100",
      trx_amt: 1,
      trx_snd: {
        "1": "B23CC40129E1801A000000001000009C",
        "3": "000000",
        "4": 1,
        "7": "2019-07-04 13:52:45",
        "11": 611,
        "12": "135245",
        "13": "20190704",
        "14": "0801",
        "17": "20190704",
        "18": 7399,
        "22": 810,
        "32": "0016",
        "35": "5286250000025044=2008",
        "37": "888599782051",
        "40": "101",
        "41": "009372          ",
        "42": "000000002531507",
        "43": "WIZZITpay  TEST                       ZA",
        "48": "000000000466789",
        "49": "710",
        "60": "WZITPRO1+0000000",
        "61": "ABSAPRO1000",
        "100": "00000000000",
        "121": "                    ",
        "124": "118085000",
        "125": "000000000010",
        "126": "                                   000"
      },
      trx_recv: {
        "1": "B23CC4010BE18018000000001000009C",
        "3": "000000",
        "4": 1,
        "7": "2019-07-04 13:52:45",
        "11": 611,
        "12": "135245",
        "13": "20190704",
        "14": "0801",
        "17": "20190704",
        "18": 7399,
        "22": 810,
        "32": "0016",
        "37": "888599782051",
        "39": "00",
        "40": "101",
        "41": "009372          ",
        "42": "000000002531507",
        "43": "WIZZITpay  TEST                       ZA",
        "48": "000000000466789",
        "49": "710",
        "60": "WZITPRO1+0000000",
        "61": "ABSAPRO1000",
        "100": "00000000000",
        "121": "                    ",
        "124": "118085000",
        "125": "000000000010",
        "126": "                                   000"
      },
      trx_rsp_code: "00",
      trx_auth_code: "00000"
    }
  ]);
}
