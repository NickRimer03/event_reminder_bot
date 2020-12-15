import sendMessage from "./sendMessage.mjs";
import stringReplacer from "./stringReplacer.mjs";
import { texts } from "../config.mjs";

export default function startTimer({ client, author, channel, time }) {
  const { hours, minutes, format } = time;
  const date = new Date();
  const d = new Date(0);

  d.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  d.setUTCHours(format === "pm" ? +hours + 12 : hours, minutes);

  if (d < date) {
    d.setUTCDate(date.getUTCDate() + 1);
  }

  return client.setTimeout(() => {
    sendMessage(channel, stringReplacer(texts.alarm, author, new Date()));
  }, d - date);
}
