import type { StrictPinoOptions } from './pino-logger.types';
import { startTime } from 'pino-http';
import { pinoLoggerModuleOptions } from './pino-http.options'; // Move options to separate file

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

export const customMessagesHttp: Pick<
  StrictPinoOptions,
  'customReceivedMessage' | 'customSuccessMessage' | 'customErrorMessage'
> = {
  customReceivedMessage(req, _) {
    return `REQUEST: ${req.method} ${req.url}`;
  },
  customSuccessMessage(req, res) {
    // Adapt for Hono's request/response objects
    return pinoLoggerModuleOptions.pinoHttp.customSuccessMessage(
      {
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers,
      },
      {
        statusCode: res.status,
        statusMessage: res.statusText,
        [startTime]: res.timing?.startTime,
      },
    );
  },
  customErrorMessage(req, res, error) {
    return pinoLoggerModuleOptions.pinoHttp.customErrorMessage(
      {
        id: req.id,
        method: req.method,
        url: req.url,
        headers: req.headers,
      },
      {
        statusCode: res.status,
        [startTime]: res.timing?.startTime,
      },
      error,
    );
  },
};
