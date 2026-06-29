export const API_URL =
  process.env.NEXT_PUBLIC_MODE === "DEVELOPMENT"
    ? "http://localhost:3465/api/v2"
    : "https://backend.pariksha.solutions/api/v2";

