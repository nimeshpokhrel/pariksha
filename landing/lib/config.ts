const config = {
  development: {
    apiUrl: "http://localhost:3465/api/v2",
    imageUrl: "https://utfs.io/f",
    appLink: "https://app.pariksha.solutions"
  },
  production: {
    apiUrl: "https://backend.pariksha.solutions/api/v2",
    imageUrl: "https://utfs.io/f",
    appLink: "https://app.pariksha.solutions"
  },
};

const environment = (process.env.NEXT_PUBLIC_ENV || "development") as
  | "development"
  | "production";

export const { apiUrl, imageUrl, appLink } = config[environment];
 
