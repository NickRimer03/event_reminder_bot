import Discord from "discord.js";
import config from "./config.json";
import { rejectPromise } from "./src/utils.mjs";
import { helpText, reportGood } from "./src/texts.mjs";

const Client = new Discord.Client();
const { RichEmbed } = Discord;
const { cmdPrefix, argPrefix, maxDisplayNameLength, usersPerTable } = config;
const users = { members: new Map(), longest: 0 };

Client.on("ready", () => {
  console.log("-- event_reminder_bot ready");
});

Client.on("message", message => {
  const { author, channel, content } = message;

  if (author.bot) {
    return;
  }

  if (!content.startsWith(cmdPrefix)) {
    return;
  }

  const str = content.slice(cmdPrefix.length).trim();
  const cmd = (str.match(/^\S+/) || [])[0];
  const args = (str.match(new RegExp(`${argPrefix}\\S+(\\s[^-]\\S+)?`, "g")) || []).map(elem =>
    Object.fromEntries(elem.split(/ +/).map((e, i) => (i === 0 ? ["key", e.slice(argPrefix.length)] : ["val", e])))
  );
  const keys = args.map(({ key }) => key);

  // SERVICE COMMANDS
  if (["c", "clr", "clear"].includes(cmd)) {
    channel.bulkDelete(100).catch(err => console.log(err));
  }

  // COMMON COMMANDS
  if (["h", "help"].includes(cmd)) {
    channel.send(helpText).then(
      () => {
        message.react(reportGood).catch(err => console.log(err));
      },
      error => rejectPromise(message, error)
    );
  }
  if (["u", "users"].includes(cmd)) {
    if (keys.includes("list")) {
      if (users.members.size === 0) {
        channel
          .send("User list is empty.")
          .then(() => message.react(reportGood), error => rejectPromise(message, error));
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
        footer: { icon_url: Client.user.avatarURL, text: "© Power Forge" }
      });
      channel.send(embed).then(() => message.react(reportGood), error => rejectPromise(message, error));
    } else if (keys.includes("all")) {
      users.members.clear();
      users.longest = 0;
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
      message.react(reportGood).catch(err => console.log(err));
    }
  }
});

Client.login(process.argv[2] || process.env.BOT_TOKEN).catch(err => console.log(err));

// https://discordapp.com/oauth2/authorize?&client_id=629573698021621762&scope=bot&permissions=10304
