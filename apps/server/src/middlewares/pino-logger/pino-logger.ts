import { pinoLogger as logger } from 'hono-pino';
import { TIME_FORMAT } from 'i18n/datetime';
import pino from 'pino';
import { pinoLoggerModuleOptions } from './pino-http.options';
import { streams } from './pino.streams';

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            ignore: 'pid,reqId,hostname',
            customColors: 'error:red,warn:yellow,info:cyan,debug:green',
            messageFormat: '{msg}',
            translateTime: TIME_FORMAT.DEFAULT,
          },
        },
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            // Minimal headers to avoid cloning issues
            headers: {
              host: req.headers.host,
              'user-agent': req.headers['user-agent'],
            },
            id: req.id,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
          }),
        },
        formatters: pinoLoggerModuleOptions.pinoHttp.formatters,
      },
      pino.multistream(streams, {
        dedupe: true,
      }),
    ),
    http: {
      ...pinoLoggerModuleOptions.pinoHttp,
      reqId: () => crypto.randomUUID(),
    },
  });
}
