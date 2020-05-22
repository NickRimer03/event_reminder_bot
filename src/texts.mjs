import appConfig from "../config.mjs";

const { argPrefix } = appConfig;

export const helpText = `\`\`\`Bot command list:

= Common commands =
h, help - shows this message

= Service commands =
c, clr, clear - clears 100 last fresh messages
\`\`\``;

export const botReady = "-- event_reminder_bot ready";
export const reportGood = "✅";
export const reportBad = "❌";
export const dbError = "Error with connection to database. Please, contact this bot creator.";

export const service = {
  clear: {
    mode: "> trying to clear last 100 messages",
    ok: "> cleared last 100 messages",
    fail: "> error clearing last 100 messages",
  },
  help: {
    mode: "> trying to send help info",
    ok: "> show help message ok",
    fail: "> error showing help",
  },
  logEnd: "---",
};

export const regExpPatterns = {
  args: `\\s+${argPrefix}[a-zA-Z0-9]+(\\s+[a-zA-Z0-9]+)?`,
  unwanted: /[^A-Za-zА-Яа-я 0-9.,?"!@#$%^&*()\-_=+;:<>\/\\|{}\[\]`~]*/g,
};

export default { helpText, botReady, reportGood, reportBad, dbError, service, regExpPatterns };
