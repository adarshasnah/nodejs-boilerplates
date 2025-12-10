import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorMiddleware(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;

  const isProd = process.env.NODE_ENV === "production";

  logger.error(
    {
      err,
      statusCode,
    },
    "Unhandled error",
  );

  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    ...(err.details !== undefined ? { details: err.details } : {}),
    ...(isProd ? null : { stack: err.stack }),
  });
}
