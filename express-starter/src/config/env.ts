import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "test" | "production";

const nodeEnv = (process.env.NODE_ENV as NodeEnv) || "development";

// function required(envName: string): string {
//   const value = process.env[envName];
//   if (!value) {
//     throw new Error(`Missing required environment variable: ${envName}`);
//   }
//   return value;
// }

export const env = {
  nodeEnv,
  isProd: nodeEnv === "production",
  isDev: nodeEnv === "development",
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || (nodeEnv === "production" ? "info" : "debug"),
  // example of required var:
  // databaseUrl: required("DATABASE_URL"),
};
