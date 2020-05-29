import PG from "pg";
import { parseDBUsersTable } from "./utils.mjs";

const usersTableName = "guild_users";
const serviceTableName = "service_info";

let pool = null;

export async function getDBServiceInfo() {
  try {
    pool = new PG.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM ${serviceTableName}`);
    client.end();

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

export async function updateDBUsers({ deleteThis, addThis }) {
  try {
    const client = await pool.connect();
    let query = "";

    if (addThis.size) {
      query += "INSERT INTO guild_users (id, rancor, aat, sith) VALUES ";
      addThis.forEach(({ rancor, aat, sith }, id) => {
        query += `(${id}, ${rancor}, ${aat}, ${sith}),`;
      });
      query = query.slice(0, -1);
    }

    if (deleteThis.length) {
      query += "DELETE FROM guild_users WHERE ";
      deleteThis.forEach((id, i) => {
        query += `id = '${id}'${i === deleteThis.length - 1 ? "" : " OR "}`;
      });
    }

    await client.query(query);
    client.end();
  } catch (err) {
    console.log(err);
  }
}

export async function getDBUsers(guild) {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM ${usersTableName}`);
    client.end();

    return parseDBUsersTable({ table: result.rows, guild });
  } catch (err) {
    console.log(err);
  }
}

export default { getDBUsers, getDBServiceInfo, updateDBUsers };
