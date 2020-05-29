import { log, rejectPromise, resolvePromise } from "../utils.mjs";
import { helpText, service } from "../texts.mjs";

const command = "help";

export default ({ message }) => {
  const { channel } = message;

  log(service.help.mode);

  channel
    .send(helpText)
    .then(() => resolvePromise({ message, command }))
    .catch((error) => rejectPromise({ message, error, command }));
};
