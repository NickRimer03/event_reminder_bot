import app from "./app.mjs";

if (process.env.BUILD_MODE !== "production") {
  Promise.all([import("dotenv"), import("path")]).then(
    ([
      {
        default: { config },
      },
      path,
    ]) => {
      config({ path: path.resolve() + "/.env" });
      app();
    }
  );
} else {
  app();
}
