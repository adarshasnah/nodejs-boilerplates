import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port} (env: ${env.nodeEnv})`);
});

// Graceful shutdown
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

for (const signal of signals) {
  process.on(signal, () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close((err) => {
      if (err) {
        logger.error({ err }, "Error during server close");
        process.exit(1);
      }
      logger.info("Server closed. Bye 👋");
      process.exit(0);
    });
  });
}

// Optional: crash on unhandled errors so k8s can restart
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
