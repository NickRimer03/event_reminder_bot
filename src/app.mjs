import Discord from "discord.js";
import { main, regexp, texts } from "../config.mjs";
import stringReplacer from "./stringReplacer.mjs";
import sendMessage from "./sendMessage.mjs";
import startTimer from "./startTimer.mjs";

const { prefix, separators, moderator } = main;
const { reg_time } = regexp;
const time = {
  hours: "",
  minutes: "",
  format: "",
};
const timers = {};

export default () => {
  const client = new Discord.Client();

  client.on("ready", () => {
    console.log(texts.botReady);
  });

  client.on("message", (message) => {
    const { author, member, channel, content } = message;

    if (author.bot) return;

    if (!member.roles.cache.some(({ id }) => id === moderator)) {
      sendMessage(channel, stringReplacer(texts.noModeratorRole, author));
      return;
    }

    if (!content.startsWith(prefix)) return;

    const args = content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") {
      channel.send(`${author} pong!`).catch((err) => console.log(err));
    } else if (cmd === "clear") {
      channel.bulkDelete(100).catch((err) => console.log(err));
    } else if (cmd === "timer") {
      if (!args.length || args.length > 3) {
        sendMessage(channel, stringReplacer(texts.incorrectNumberOfArguments, author, cmd, args.length, 1, 2, 3));
        return;
      }

      if (args.length === 3) {
        const [argName, argTime, argFormat] = args;

        if (!timers.hasOwnProperty(argName)) {
          if (argTime.match(new RegExp(reg_time)) === null) {
            sendMessage(channel, stringReplacer(texts.argTimeIsNotATime, author, argTime));
            return;
          }

          if (isNaN(+argTime) || argTime.indexOf(".") !== -1) {
            let separatorIdx = -1;
            let i = 0;
            do {
              separatorIdx = argTime.indexOf(separators[i]);
              i += 1;
            } while (separatorIdx === -1 && i < separators.length);
            if (separatorIdx === -1) {
              sendMessage(channel, stringReplacer(texts.timeSeparatorWrong, author, separators.join(" ")));
            }

            const separator = separators[i - 1];
            [[time.hours, time.minutes], time.format] = [argTime.split(separator), argFormat];
          } else {
            [time.hours, time.minutes, time.format] = [argTime, "", argFormat];
          }

          let { hours, minutes, format } = time;

          if (!["am", "pm"].includes(format)) {
            sendMessage(channel, stringReplacer(texts.timeFormatWrong, author, format));
            return;
          }
          if (isNaN(hours) || +hours < 0 || +hours > 12) {
            sendMessage(channel, stringReplacer(texts.wrongTimeValue, author, hours, "hours"));
            return;
          }
          if (isNaN(minutes) || +minutes < 0 || +minutes > 59) {
            sendMessage(channel, stringReplacer(texts.wrongTimeValue, author, minutes, "minutes"));
            return;
          }

          hours = hours.slice(-2).padStart(2, "0");
          minutes = minutes.slice(-2).padStart(2, "0");
          timers[argName] = {
            hours,
            minutes,
            format,
            run: true,
            timerId: null,
          };

          timers[argName].timerId = startTimer({ client, author, channel, time: timers[argName] });
          sendMessage(channel, stringReplacer(texts.setTimer, author, argName, hours, minutes, format));
        } else {
          sendMessage(channel, stringReplacer(texts.timerNameExists, author, argName));
        }
      } else if (args.length === 2) {
        const [argName, argMode] = args;

        if (!timers.hasOwnProperty(argName)) {
          sendMessage(channel, stringReplacer(texts.noTimerName, author, argName));
          return;
        }
        if (!["start", "stop"].includes(argMode)) {
          sendMessage(channel, stringReplacer(texts.modeWrong, author, argMode));
          return;
        }

        if (argMode === "stop") {
          if (!timers[argName].run) {
            sendMessage(channel, stringReplacer(texts.stoppingError, author));
            return;
          }

          client.clearTimeout(timers[argName].timerId);
          timers[argName].run = false;
          sendMessage(channel, stringReplacer(texts.timerStopped, author, argName));
        } else {
          if (timers[argName].run) {
            sendMessage(channel, stringReplacer(texts.startingError, author));
            return;
          }

          timers[argName].run = true;
          timers[argName].timerId = startTimer({ client, author, channel, time: timers[argName] });
        }
      } else {
        const argName = args[0];

        if (!timers.hasOwnProperty(argName)) {
          sendMessage(channel, stringReplacer(texts.noTimerName, author, argName));
          return;
        }

        const info = {
          hours: timers[argName].hours,
          minutes: timers[argName].minutes,
          format: timers[argName].format,
          run: timers[argName].run,
        };
        sendMessage(channel, `Timer '${argName}' info\n\`\`\`${JSON.stringify(info, null, 2)}\`\`\``);
      }
    } else {
      sendMessage(channel, stringReplacer(texts.unknownCommand, author, cmd, args));
    }
  });

  client.login(process.env.BOT_TOKEN).catch((err) => console.log(err));
};
