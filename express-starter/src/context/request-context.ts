import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

export interface RequestContext {
  requestId: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
  /**
   * Create a new context.
   * Uses X-Request-Id if provided, otherwise generates a new UUID.
   */
  create(inboundRequestId?: string | null): RequestContext {
    let requestId = inboundRequestId?.trim();

    if (!requestId) {
      requestId = randomUUID();
    }

    return { requestId };
  },

  /**
   * Run a function within a request scope.
   */
  run(context: RequestContext, fn: () => void) {
    storage.run(context, fn);
  },

  /**
   * Get the active context.
   */
  get(): RequestContext | undefined {
    return storage.getStore();
  },

  /**
   * Get only the requestId.
   */
  getRequestId(): string | undefined {
    return storage.getStore()?.requestId;
  },
};
