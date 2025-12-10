import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware.js";
import { router } from "./routes/index.js";

export function createApp() {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: env.isProd ? undefined : false,
    }),
  );

  // CORS (use a stricter origin list in real prod)
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  // Body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // HTTP logging (combined morgan + pino)
  if (!env.isProd) {
    app.use(morgan("dev"));
  }

  app.use(
    pinoHttp({
      logger,
      autoLogging: true,
    }),
  );

  // Custom request logging / tracing
  app.use(requestLoggerMiddleware);

  // Routes
  app.use("/api", router);

  // 404
  app.use(notFoundMiddleware);

  // Error handler
  app.use(errorMiddleware);

  return app;
}
