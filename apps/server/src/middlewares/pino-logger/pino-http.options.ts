import type { StrictPinoOptions } from './pino-logger.types';
import { randomUUID } from 'node:crypto';
import { customMessages } from './pino.messages';
// import PinoPretty from 'pino-pretty';
// import { pinoPrettyOptions } from './pino-logger.pretty';

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
