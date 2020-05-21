import path from "path";
import dotEnv from "dotenv";
import Discord from "discord.js";
import emitter from "./src/emitter.mjs";
import AppState from "./src/state.mjs";

dotEnv.config({ path: path.resolve() + "/.env" });

const state = new AppState();
const client = new Discord.Client();

client.on("ready", () => {
  console.log("-- event_reminder_bot ready");
  state.bot = true;
});

client.on("message", (message) => {
  emitter.emit("onmessage", { message, state, client });
});

client.login(process.env.BOT_TOKEN).catch((err) => console.log(err));
