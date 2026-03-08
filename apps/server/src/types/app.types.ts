import type { Context, Handler, Hono } from 'hono';
import type { PinoLogger } from 'hono-pino';

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenAPI = Hono<AppBindings>;

// Handlers are plain Hono handlers — no route type parameter needed
export type AppHandler = Handler<AppBindings>;

// Per-handler context typing
export type AppContext = Context<AppBindings>;
