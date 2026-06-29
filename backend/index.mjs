// MUST be first: loads .env (absolute path, override) before any module that
// reads process.env at import time (e.g. the AdminJS session store in app.js).
import "./src/config/env.js";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import { dbFunction } from "./src/functions/dbChangeFunctions.js";
import { qotdGenerator } from "./src/functions/generateqotd.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      process.exit(1);
    });
    app.listen(process.env.PORT || 3465, () => {
      console.log(`\nServer live at Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed.", err);
  });