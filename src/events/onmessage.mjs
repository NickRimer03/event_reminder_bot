import { dbError, reportBad, reportGood, service } from "../texts.mjs";
import { log, rejectPromise, repl } from "../utils.mjs";
import { getDBUsers } from "../db.mjs";
import emitter from "../emitter.mjs";
import appConfig from "../../config.mjs";
import Discord from "discord.js";

const { cmdPrefix, maxDisplayNameLength, usersPerTable } = appConfig;
const { RichEmbed } = Discord;
// const query = [];

export default ({ message, state, client }) => {
  const { author, channel, content } = message;
  const { db, dbConfig } = state;
  const { user } = client;

  if (author.bot || !content.startsWith(cmdPrefix)) {
    return;
  }

  if (!db) {
    channel.send(dbError).catch((err) => console.log(err));
  }

  const { cmd, args, keys } = repl(content);
  log("cmd: ", cmd);
  log("args: ", args);
  log("keys: ", keys);

  // SERVICE COMMANDS
  if (["c", "clr", "clear"].includes(cmd)) {
    emitter.emit("onclear", { message });
  }

  // COMMON COMMANDS

  // HELP
  else if (["h", "help"].includes(cmd)) {
    emitter.emit("onhelp", { message });
  }

  // USER COMMANDS
  else if (["u", "users"].includes(cmd)) {
    if (keys.includes("list")) {
      getDBUsers(message.guild).then(
        (users) => {
          if (users.members.size === 0) {
            channel.send("User list is empty.").then(
              () => message.react(reportGood),
              (error) => rejectPromise(message, error)
            );
            return;
          }

          let idx = 1;
          let pointer = 0;
          const gm = "Guild member";
          const r = "Rancor";
          const t = "AAT";
          const s = "Sith";
          const header =
            `|  # | ${gm}` +
            " ".repeat(users.longest - gm.length) +
            ` | ${r} | ${t} | ${s} |\n` +
            `|----|-${"-".repeat(gm.length)}` +
            "-".repeat(users.longest - gm.length) +
            `-|-${"-".repeat(r.length)}-|-${"-".repeat(t.length)}-|-${"-".repeat(s.length)}-|\n`;
          const list = [];
          users.members.forEach(({ name, rancor, aat, sith }) => {
            if (list.length === pointer) {
              list.push({ value: "", from: usersPerTable * pointer + 1, to: usersPerTable * pointer });
            }
            const clrName = name.replace(/[^A-Za-zА-Яа-я 0-9.,?"!@#$%^&*()\-_=+;:<>\/\\|{}\[\]`~]*/g, "");
            list[pointer].value += `| ${idx.toString().padStart(2, " ")} `;
            list[pointer].value += `| ${clrName}`;
            list[pointer].value += `${" ".repeat(users.longest - clrName.length)} `;
            list[pointer].value +=
              `| ${rancor ? "+" : "-"}` +
              " ".repeat(r.length - 1) +
              ` | ${aat ? "+" : "-"}` +
              " ".repeat(t.length - 1) +
              ` | ${sith ? "+" : "-"}` +
              " ".repeat(s.length - 1) +
              ` |\n`;
            list[pointer].to++;
            if (idx++ % usersPerTable === 0) {
              pointer++;
            }
          });
          const embed = new RichEmbed({
            color: 0xf0f0f0,
            title: "List of guild members",
            description: "Status of raid notifications for every guild member.",
            fields: [{ name: "=== Guild member list ===", value: `\`\`\`${header}\`\`\`` }].concat(
              list.map(({ value, from, to }) => ({ name: `${from}-${to}`, value: `\`\`\`${value}\`\`\`` }))
            ),
            footer: { icon_url: user.avatarURL, text: "© Power Forge" },
          });
          channel.send(embed).then(
            () => message.react(reportGood),
            (error) => rejectPromise(message, error)
          );
        },
        (err) => console.log(err)
      );
    } else if (keys.includes("update")) {
      const role = (dbConfig.find(({ guildID }) => guildID.trim() === message.guild.id) || {}).servicePermissionsRole;
      if (message.member.roles.find(({ name }) => name === role)) {
        channel.send("Not enough permissions.").then(
          () => {
            message.react(reportBad).catch((err) => console.log(err));
          },
          (error) => rejectPromise(message, error)
        );
        return;
      }

      getDBUsers(message.guild).then(
        (users) => {
          message.guild.members.forEach(({ id, displayName, user: { bot } }) => {
            if (bot) {
              return;
            }

            const name =
              displayName.length > maxDisplayNameLength
                ? `${displayName.slice(0, maxDisplayNameLength - 3)}...`
                : displayName;
            users.members.set(id, { name, rancor: false, aat: false, sith: false });
            if (name.length > users.longest) {
              users.longest = name.length;
            }
          });
        },
        (err) => console.log(err)
      );
      // message.react(reportGood).catch(err => console.log(err));
      // // ADD TO DATABASE
      // (async () => {
      //   try {
      //     const client = await pool.connect();
      //     let query = "INSERT INTO guild_users (id, rancor, aat, sith) VALUES ";
      //     users.members.forEach(({ rancor, aat, sith }, key) => {
      //       query += `(${key}, ${rancor}, ${aat}, ${sith}),`;
      //     });
      //     const result = await client.query(query.slice(0, -1));
      //     client.release();
      //   } catch (err) {
      //     console.log(err);
      //   }
      // })();
    }
  }

  // NOTHING
  else {
    log(service.logEnd);
  }
};
