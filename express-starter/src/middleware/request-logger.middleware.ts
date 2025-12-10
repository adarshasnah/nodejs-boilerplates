import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  // attach to req so you can use later
  // biome-ignore lint/suspicious/noExplicitAny: false
  (req as any).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  logger.debug(
    {
      requestId,
      method: req.method,
      url: req.originalUrl,
    },
    "Incoming request",
  );

  res.on("finish", () => {
    logger.debug(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
      },
      "Request completed",
    );
  });

  next();
}
