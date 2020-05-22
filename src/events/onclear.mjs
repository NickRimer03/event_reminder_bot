import { log, rejectPromise, resolvePromise } from "../utils.mjs";
import { service } from "../texts.mjs";

export default ({ message }) => {
  const { channel } = message;

  log(service.clear.mode);

  channel
    .bulkDelete(100)
    .then(() => resolvePromise({ command: "clear", react: false }))
    .catch((error) => rejectPromise({ message, error, command: "clear" }));
};
