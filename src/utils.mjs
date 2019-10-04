import { reportBad } from "./texts.mjs";

export function rejectPromise(msg, err) {
  msg.react(reportBad).catch(err => console.log(err));
  console.log(err);
}

export default { rejectPromise };
