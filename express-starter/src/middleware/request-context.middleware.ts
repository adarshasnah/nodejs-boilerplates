import type { NextFunction, Request, Response } from "express";
import { requestContext } from "../context/request-context.js";

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  // Accept inbound X-Request-Id header (case-insensitive)
  const inboundRequestId = (req.headers["x-request-id"] as string | undefined) ?? null;

  const context = requestContext.create(inboundRequestId);

  // Expose it to clients as well
  res.setHeader("X-Request-Id", context.requestId);

  // Run the request inside the ALS context
  requestContext.run(context, next);
}
