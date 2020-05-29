import emitter from "../emitter.mjs";
import appConfig from "../../config.mjs";
import { log, repl } from "../utils.mjs";
import { dbError, service } from "../texts.mjs";

const { cmdPrefix } = appConfig;
// const query = [];

export default ({ message, state, client }) => {
  const { author, channel, content } = message;
  const { db } = state;

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
    emitter.emit("onusers", { message, state, client, keys });
  }

  // NOTHING
  else {
    log(service.logEnd);
  }
};
