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

        // Method color codes
        const methodColors: Record<string, string> = {
          GET: '\x1B[32m', // Green
          POST: '\x1B[33m', // Yellow
          PATCH: '\x1B[33m', // Yellow
          PUT: '\x1B[36m', // Cyan
          DELETE: '\x1B[31m', // Red
          OPTIONS: '\x1B[35m', // Magenta
        };

        // Status code color codes
        const getStatusColor = (statusCode?: number): string => {
          if (!statusCode) return reset;
          if (statusCode >= 200 && statusCode < 300) return '\x1B[32m'; // Green for success
          if (statusCode >= 300 && statusCode < 400) return '\x1B[33m'; // Yellow for redirects
          if (statusCode >= 400) return '\x1B[31m'; // Red for errors
          return reset;
        };

        // Format the output like your previous logger
        if (data.req) {
          // Extract method and colorize it
          const method = data.req.method || 'UNKNOWN';
          const methodColor = methodColors[method] || reset;
          const methodDisplay = `${methodColor}[${method}]${reset}`;

          // Extract status code and colorize it
          const statusCode = data.res?.statusCode || data.res?.res?.statusCode;
          const statusColor = getStatusColor(statusCode);
          const statusDisplay = statusCode ? `${statusColor}${statusCode}${reset}` : 'N/A';

          // Determine success/fail indicator
          const isSuccess = statusCode && statusCode >= 200 && statusCode < 300;
          const isError = statusCode && statusCode >= 400;
          const statusIndicator = isSuccess
            ? '\x1B[32m✓\x1B[0m'
            : isError
              ? '\x1B[31m✗\x1B[0m'
              : '\x1B[33m○\x1B[0m';

          // Request log - enhanced format
          console.log(`1. ${methodDisplay} ${data.req.url || ''} ${statusIndicator} ${statusDisplay}`);
          console.log(`2. ${methodDisplay}${level.toUpperCase()}${reset} [${time}]: ${color}${msg}${reset}`);
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
