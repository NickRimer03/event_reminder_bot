import PG from "pg";
import { parseDBUsersTable } from "./utils.mjs";

const usersTableName = "guild_users";
const serviceTableName = "service_info";
const pool = new PG.Pool({ connectionString: process.argv[3] || process.env.DATABASE_URL, ssl: true });

export async function getDBServiceInfo() {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM ${serviceTableName}`);
    client.release();

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

export async function getDBUsers(guild) {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM ${usersTableName}`);
    client.release();

    return parseDBUsersTable(result.rows, guild);
  } catch (err) {
    console.log(err);
  }
}

export default { getDBUsers, getDBServiceInfo };
