import { pinoLogger as logger } from 'hono-pino';
import pino from 'pino';
import { pinoLoggerModuleOptions } from './pino-http.options';

export function pinoLogger() {
  const isProduction = process.env.NODE_ENV === 'production';

  return logger({
    pino: pino(
      {
        level: isProduction ? 'info' : 'debug',
        // Custom formatting without pino-pretty to avoid thread-stream crashes
        serializers: {
          req: (req: any) => ({
            method: req.method,
            url: req.url,
            // Minimal headers to avoid cloning issues
            headers: {
              'host': req.headers.host,
              'user-agent': req.headers['user-agent'],
            },
            id: req.id,
          }),
          res: (res: any) => ({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
          }),
        },
        formatters: pinoLoggerModuleOptions.pinoHttp.formatters,
      },
      // Use process.stdout for development (pretty) or undefined for production
      isProduction ? undefined : process.stdout,
    ),
    http: {
      ...pinoLoggerModuleOptions.pinoHttp,
      reqId: () => crypto.randomUUID(),
    },
  });
}
