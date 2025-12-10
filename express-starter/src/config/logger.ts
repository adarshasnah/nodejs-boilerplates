import pino from "pino";
import { requestContext } from "../context/request-context.js";
import { env } from "./env.js";

export const logger = pino({
  level: env.logLevel,
  mixin() {
    const ctx = requestContext.get();
    return ctx ? { requestId: ctx.requestId } : {};
  },
  transport: env.isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
});
