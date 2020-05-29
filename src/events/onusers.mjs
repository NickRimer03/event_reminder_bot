import Discord from "discord.js";
import appConfig from "../../config.mjs";
import { getDBUsers, updateDBUsers } from "../db.mjs";
import { rejectPromise, mergeArrays, cutUserName } from "../utils.mjs";
import { reportBad, reportGood, noPermissions } from "../texts.mjs";

const rolePowerForge = "628911188763475979";

const command = "users";
const { MessageEmbed } = Discord;
const { usersPerTable } = appConfig;

export default ({ message, state, client, keys }) => {
  const { channel } = message;
  const { user } = client;
  const { dbConfig } = state;

  if (keys.includes("list")) {
    getDBUsers(message.guild)
      .then((users) => {
        if (users.members.size === 0) {
          channel
            .send("User list is empty.")
            .then(() => message.react(reportGood))
            .catch((error) => rejectPromise({ message, error, command }));
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
        const embed = new MessageEmbed({
          color: 0xf0f0f0,
          title: "List of guild members",
          description: "Status of raid notifications for every guild member.",
          fields: [{ name: "=== Guild member list ===", value: `\`\`\`${header}\`\`\`` }].concat(
            list.map(({ value, from, to }) => ({ name: `${from}-${to}`, value: `\`\`\`${value}\`\`\`` }))
          ),
          footer: { icon_url: user.avatarURL, text: "© Power Forge" },
        });
        channel
          .send(embed)
          .then(() => message.react(reportGood))
          .catch((error) => rejectPromise({ message, error, command }));
      })
      .catch((err) => console.log(err));
  } else if (keys.includes("update") || keys.includes("upd")) {
    const role = (dbConfig.find(({ guildID }) => guildID.trim() === message.guild.id) || {}).servicePermissionsRole;
    if (message.member.roles.cache.find(({ name }) => name === role)) {
      channel
        .send(noPermissions)
        .then(() => {
          message.react(reportBad).catch((err) => console.log(err));
        })
        .catch((error) => rejectPromise({ message, error, command }));
      return;
    }

    getDBUsers(message.guild).then(
      (usersInDB) => {
        const usersInGuild = message.guild.members.cache.filter(
          ({ user: { bot }, roles }) => bot === false && roles.cache.has(rolePowerForge)
        );
        const uniqueIds = mergeArrays(
          Array.from(usersInDB.members).map(([id]) => id),
          usersInGuild.map(({ id }) => id)
        );
        const deleteThis = [];
        const addThis = uniqueIds.reduce((map, id) => {
          if (!usersInDB.members.has(id) && usersInGuild.has(id)) {
            return map.set(id, {
              name: cutUserName(usersInGuild.get(id).displayName),
              rancor: false,
              aat: false,
              sith: false,
            });
          }

          if (usersInDB.members.has(id) && !usersInGuild.has(id)) {
            deleteThis.push(id);
          }
        }, new Map());
        updateDBUsers({ deleteThis, addThis })
          .then(() => {
            message.react(reportGood).catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      },
      (err) => console.log(err)
    );
  }
};
