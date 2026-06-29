// Standalone DB connection test — run on the SERVER where the app lives:
//   cd <backend dir> && node testdb.mjs
// It loads the same .env the app does and tries the same connection, then
// tells you exactly which layer is failing. Safe to delete afterwards.
import "./src/config/env.js";
import mongoose from "mongoose";
import { DB_NAME } from "./src/constants.js";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is NOT set — the .env did not load. (env/path problem)");
  process.exit(1);
}

// Print the host only, with credentials masked, so you can confirm WHICH user/cluster.
const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, (_, user) => `//${user}:****@`);
console.log("Using URI:", masked, "  db:", DB_NAME);

try {
  await mongoose.connect(`${uri}/${DB_NAME}`, { serverSelectionTimeoutMS: 8000 });
  console.log("✅ SUCCESS — credentials and network are good.");
  await mongoose.disconnect();
  process.exit(0);
} catch (e) {
  console.error("❌ FAILED:", e.message);
  if (/bad auth|Authentication failed/i.test(e.message)) {
    console.error("   -> Wrong username/password (or a stale value is shadowing your .env).");
  } else if (/ENOTFOUND|querySrv|timed out|ECONNREFUSED|no primary/i.test(e.message)) {
    console.error("   -> Network/allowlist: add this server's IP to Atlas Network Access.");
  }
  process.exit(1);
}
