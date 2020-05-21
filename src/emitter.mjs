import Emitter from "events";
import onmessage from "./onmessage.mjs";

const emitter = new Emitter();

emitter.on("onmessage", (message) => {
  onmessage(message);
});

export default emitter;
