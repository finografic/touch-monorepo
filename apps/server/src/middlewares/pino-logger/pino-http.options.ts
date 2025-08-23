import type { StrictPinoOptions } from './pino-logger.types';
import { randomUUID } from 'node:crypto';

export const customMessages: Pick<
  StrictPinoOptions,
  'customReceivedMessage' | 'customSuccessMessage' | 'customErrorMessage'
> = {
  customReceivedMessage(req, _) {
    return `REQUEST: ${req.method} ${req.url}`;
  },
  customSuccessMessage(req, res) {
    return `RESPONSE: ${req.method} ${req.url} -> ${res.statusCode} ${res.statusMessage}`;
  },
  customErrorMessage(req, res, error) {
    return `ERROR: ${req.method} ${req.url} -> ${res.statusCode} ${res.statusMessage} ${error.message}`;
  },
};

export const pinoLoggerModuleOptions: { pinoHttp: StrictPinoOptions } = {
  pinoHttp: {
    autoLogging: true,
    ...customMessages,
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
    genReqId(req, res) {
      const existingID = req.id ?? req.headers['x-request-id'];
      if (existingID) {
        return existingID;
      }
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    mixin(mergeObject: any) {
      let newMergeObject = mergeObject;
      if (!newMergeObject.msg && newMergeObject.message) {
        newMergeObject = {
          ...newMergeObject,
          context: newMergeObject.context ?? 'HTTP',
          msg: newMergeObject.message,
        };
        if (newMergeObject.msg && !newMergeObject.message) {
          newMergeObject = {
            ...newMergeObject,
            context: newMergeObject.context ?? 'HTTP',
            msg: newMergeObject.msg,
          };
        }
      }
      return newMergeObject;
    },
    quietReqLogger: true,
    serializers: {
      err: (err) => {
        return {
          id: err.id,
          message: err.message,
          stack: err.stack,
        };
      },
      req: (req) => {
        return {
          host: req.headers.host,
          id: req.id,
          method: req.method,
          url: req.url,
        };
      },
      res: (res) => {
        return {
          res,
        };
      },
    },
    // stream: process.env.NODE_ENV !== 'production' ? PinoPretty(pinoPrettyOptions) : undefined,
  },
};
