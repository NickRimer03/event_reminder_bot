import appConfig from "../config.mjs";
import { reportBad } from "./texts.mjs";

const { maxDisplayNameLength } = appConfig;

export function rejectPromise(msg, err) {
  msg.react(reportBad).catch((err) => console.log(err));
  console.log(err);
}

export function cutUnwantedSymbols(str) {
  return str.replace(/[^A-Za-zА-Яа-я 0-9.,?"!@#$%^&*()\-_=+;:<>\/\\|{}\[\]`~]*/g, "");
}

export function cutUserName(name) {
  const cutName = cutUnwantedSymbols(name);
  return cutName.length > maxDisplayNameLength ? `${cutName.slice(0, maxDisplayNameLength - 3)}...` : cutName;
}

export function parseDBUsersTable(table, guild) {
  const users = { members: new Map(), longest: 0 };

  table.forEach(({ id, rancor, aat, sith }) => {
    const name = cutUserName(guild.members.get(id.trim()).displayName);
    users.members.set(id.trim(), { name, rancor, aat, sith });
    if (name.length > users.longest) {
      users.longest = name.length;
    }
  });

  return users;
}

export default { rejectPromise, parseDBUsersTable, cutUserName, cutUnwantedSymbols };
