import Emitter from "events";
import onmessage from "./events/onmessage.mjs";
import onclear from "./events/onclear.mjs";
import onhelp from "./events/onhelp.mjs";
import onusers from "./events/onusers.mjs";

const emitter = new Emitter();

emitter.on("onmessage", (data) => onmessage(data));

emitter.on("onclear", (data) => onclear(data));

emitter.on("onhelp", (data) => onhelp(data));

emitter.on("onusers", (data) => onusers(data));

export default emitter;
