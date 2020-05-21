import { getDBServiceInfo } from "./db.mjs";

export default class AppState {
  constructor() {
    this.__bot = false;
    this.db = false;
    this.dbConfig = [];
  }

  set bot(value) {
    this.__bot = value;

    if (this.__bot) {
      getDBServiceInfo().then(
        (service) => {
          this.dbConfig = service;
          this.db = true;
        },
        (err) => console.log(err)
      );
    }
  }

  get bot() {
    return this.__bot;
  }
}
