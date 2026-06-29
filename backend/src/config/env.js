import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the backend/.env file by ABSOLUTE path (relative to this module),
// not the process CWD. Under cPanel/Passenger the CWD is not guaranteed to be
// the backend directory, so a CWD-relative "./.env" can silently fail to load.
//
// `override: true` makes the committed .env the single source of truth, so a
// stale variable set in the cPanel "Setup Node.js App" Environment Variables UI
// can no longer shadow it (dotenv does NOT override existing env vars by default).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/src/config/env.js  ->  backend/.env
const envPath = path.resolve(__dirname, "../../.env");

const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
  console.warn(`[env] Could not load .env from ${envPath}: ${result.error.message}`);
} else {
  console.log(`[env] Loaded environment from ${envPath}`);
}

if (!process.env.MONGODB_URI) {
  console.error(
    "[env] MONGODB_URI is not set after loading .env — check the file path and contents."
  );
}
