import { log, rejectPromise, resolvePromise } from "../utils.mjs";
import { service } from "../texts.mjs";

const command = "clear";

export default ({ message }) => {
  const { channel } = message;

  log(service.clear.mode);

  channel
    .bulkDelete(100)
    .then(() => resolvePromise({ command, react: false }))
    .catch((error) => rejectPromise({ message, error, command }));
};
