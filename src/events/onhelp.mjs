import { log, rejectPromise, resolvePromise } from "../utils.mjs";
import { helpText, service } from "../texts.mjs";

export default ({ message }) => {
  const { channel } = message;

  log(service.help.mode);

  channel
    .send(helpText)
    .then(() => resolvePromise({ message, command: "help" }))
    .catch((error) => rejectPromise({ message, error, command: "help" }));
};
