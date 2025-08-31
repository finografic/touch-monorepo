import { pinoLogger as logger } from 'hono-pino';
import pino from 'pino';
import { pinoLoggerModuleOptions } from './pino-http.options';

export function pinoLogger() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Create a custom destination for clean, focused output in development AND production
  const cleanDestination = {
    write: (chunk: any) => {
      try {
        const data = JSON.parse(chunk);

        // Extract key information
        const level = data.level || 'info';
        const time = data.time
          ? new Date(Number.parseInt(data.time, 10)).toLocaleTimeString('en-US', { hour12: false })
          : '';
        const msg = data.msg || '';

        // Color codes
        const colors = {
          error: '\x1B[31m', // Red
          warn: '\x1B[33m', // Yellow
          info: '\x1B[36m', // Cyan
          debug: '\x1B[32m', // Green
          trace: '\x1B[35m', // Magenta
        };
        const reset = '\x1B[0m';
        const color = colors[level as keyof typeof colors] || '';

        // Format the output like your previous logger
        if (data.req) {
          // Request log - clean format
          console.log(`${color}${level.toUpperCase()}${reset} [${time}]: ${color}${msg}${reset}`);
          console.log(`responseTime: ${color}${data.responseTime || 0}ms${reset}`);
          console.log(`\nres: ${JSON.stringify(data.res || {})}`);
          console.log('stdout.req:', data.req);
        } else {
          // Regular log
          console.log(`${color}${level.toUpperCase()}${reset} [${time}]: ${color}${msg}${reset}`);
        }
      } catch (e) {
        // Fallback to raw output if parsing fails
        process.stdout.write(chunk);
      }
    },
  };

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
      // Use custom clean destination for development
      cleanDestination,
    ),
    http: {
      ...pinoLoggerModuleOptions.pinoHttp,
      reqId: () => crypto.randomUUID(),
    },
  });
}
