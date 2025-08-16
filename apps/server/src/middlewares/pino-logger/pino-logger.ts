import { pinoLogger as logger } from 'hono-pino';
import pino from 'pino';
import { pinoLoggerModuleOptions } from './pino-http.options';

export function pinoLogger() {
  const isProduction = process.env.NODE_ENV === 'production';

  // Create a custom destination for pretty output + JSON in development
  const prettyDestination = isProduction
    ? undefined
    : {
        write: (chunk: any) => {
          try {
            const data = JSON.parse(chunk);

            // Extract key information
            const level = data.level || 'info';
            const time = data.time
              ? `[${new Date(Number.parseInt(data.time, 10)).toLocaleTimeString('en-US', { hour12: false })}]`
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

            // Format the pretty output
            if (data.req) {
              // Request log
              const req = data.req;
              console.log(`${time} ${color}${level.toUpperCase()}${reset} ${msg}`);
              console.log(`  ${req.method} ${req.url}`);
              if (data.responseTime) {
                console.log(`  Response time: ${data.responseTime}ms`);
              }
            } else {
              // Regular log
              console.log(`${time} ${color}${level.toUpperCase()}${reset} ${msg}`);
            }

            // Add a blank line for separation
            console.log('');

            // Output the JSON data (formatted, but we'll enhance this in next steps)
            console.log(JSON.stringify(data, null, 2));
            console.log(''); // Add another blank line for readability
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
      // Use custom pretty destination for development
      prettyDestination,
    ),
    http: {
      ...pinoLoggerModuleOptions.pinoHttp,
      reqId: () => crypto.randomUUID(),
    },
  });
}
