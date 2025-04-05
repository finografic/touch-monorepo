import type { PrettyOptions } from 'pino-pretty';
import PinoPretty from 'pino-pretty';

const magenta = (str: string): string => `\x1B[35m${str}\x1B[0m`;
const yellow = (str: string): string => `\x1B[33m${str}\x1B[0m`;
const blue = (str: string): string => `\x1B[34m${str}\x1B[0m`;
const cyan = (str: string): string => `\x1B[36m${str}\x1B[0m`;
const red = (str: string): string => `\x1B[31m${str}\x1B[0m`;
const white = (str: string): string => `\x1B[37m${str}\x1B[0m`;
const green = (str: string): string => `\x1B[32m${str}\x1B[0m`;

const prepareTrace = (trace?: string): string =>
  trace ? `🤖${magenta(`[${trace}]`)} ` : '';
const prepareErrorMessage = (message?: string): string =>
  message ? `${red(message)}` : '';
function prepareProtocol(protocol?: string): string {
  return protocol ? `🚢${magenta(`[${protocol}]`)} ` : '';
}
function prepareArrow(action: string): string {
  if (!action) return '';
  if (action === 'start') return '🔽 ';
  if (action === 'end') return '🔼 ';
  if (action === 'output') return '▶ ';
  if (action === 'input') return '◀ ';
  return '';
}

const levels = {
  10: `🟣${magenta('TRACE')}`,
  20: `🔵${blue('DEBUG')}`,
  30: `🟢${green('INFO')}`,
  40: `🟠${yellow('WARN')}`,
  50: `🔴${red('ERROR')}`,
  60: `⚫${red('FATAL')}`,
};
interface Log {
  ctx: string;
  data: Record<string, string>;
  debug: Record<string, string>;
  err: Record<string, string>;
}

export function pinoPretty(opt: PrettyOptions) {
  return PinoPretty({
    ...opt,
    translateTime: true,
    colorize: true,
    singleLine: true,
    messageKey: 'message',
    hideObject: false,
    customPrettifiers: {
      time: (timestamp) => `[🕰 ${timestamp}]`,
      pid: (name) => magenta(name.toString()),
      hostname: (name) => magenta(name.toString()),
      level: (level: string | object) =>
        levels[level as unknown as keyof typeof levels],
    },
    include: 'time,message,level,object,data,debug,ctx',
    errorLikeObjectKeys: ['err'],
    messageFormat: (log, messageKey) => {
      const message = log[messageKey] as string;
      const {
        data,
        debug: { trace, protocol },
        err,
      } = log as unknown as Log;
      if (data) {
        const { query, action, nanos } = data;
        const sqlLog = query
          ? `\n 🔎 ${yellow((query as string).trim())}\n`
          : '';
        const arrow = prepareArrow(action);
        const ms = nanos ? yellow(` ${+nanos / 1_000_000}ms`) : '';
        return `${prepareTrace(trace)}${prepareProtocol(protocol)}${arrow}${cyan(message)}${sqlLog}${ms}`;
      }
      if (err) {
        const { message: errorMessage, stack, action } = err;
        const stackLog = stack ? `\n${white(stack)}\n` : '';

        const messageLog = prepareErrorMessage(errorMessage || message);
        const arrow = prepareArrow(action);
        const readyToLog = `${prepareTrace(trace)}${prepareProtocol(protocol)}${arrow}${messageLog}${stackLog}`;
        return readyToLog;
      }

      return cyan(message);
    },
  });
}
