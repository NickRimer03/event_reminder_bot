import appConfig from "../config.mjs";
import { reportGood, reportBad, regExpPatterns, service } from "./texts.mjs";

const { cmdPrefix, argPrefix, maxDisplayNameLength } = appConfig;

export function log() {
  console.log(...arguments);
}

export function resolvePromise({ message, command, react = true }) {
  if (react) {
    message.react(reportGood).catch((err) => log(err));
  }
  log(service[command].ok);
  log(service.logEnd);
}

export function rejectPromise({ message, error, command }) {
  message.react(reportBad).catch((err) => log(err));
  log(service[command].fail);
  log(error);
  log(service.logEnd);
}

export function cutUnwantedSymbols(str) {
  return str.replace(regExpPatterns.unwanted, "");
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

export function repl(content) {
  const str = content.slice(cmdPrefix.length).trim();
  const cmd = (str.match(/^\S+/) || [])[0];
  const args = (str.match(new RegExp(regExpPatterns.args, "g")) || []).map((elem) =>
    Object.fromEntries(
      elem
        .trim()
        .split(/ +/)
        .map((e, i) => (i === 0 ? ["key", e.slice(argPrefix.length)] : ["val", e]))
    )
  );
  const keys = args.map(({ key }) => key);

  return { cmd, args, keys };
}

export default { log, resolvePromise, rejectPromise, parseDBUsersTable, cutUserName, cutUnwantedSymbols, repl };
