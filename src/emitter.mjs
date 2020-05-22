import Emitter from "events";
import onmessage from "./events/onmessage.mjs";
import onclear from "./events/onclear.mjs";
import onhelp from "./events/onhelp.mjs";

const emitter = new Emitter();

emitter.on("onmessage", (data) => onmessage(data));

emitter.on("onclear", (data) => onclear(data));

emitter.on("onhelp", (data) => onhelp(data));

export default emitter;
