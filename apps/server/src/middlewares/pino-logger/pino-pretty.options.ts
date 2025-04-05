import type { PrettyOptions } from 'pino-pretty';
import type { LevelCustom } from './pino-logger.types';
import chalk from 'chalk';
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from 'i18n/datetime';
import { formatDate } from 'utils/utils.datetime';
import { levelColors, levelSymbols } from './pino.constants';

export const pinoPrettyOptions: PrettyOptions = {
  colorize: true,
  crlf: true,
  customPrettifiers: {
    level: (inputData: string | object) => {
      const level = typeof inputData === 'string' ? inputData : '';
      return `${levelSymbols[level as LevelCustom]} ${levelColors[level as keyof typeof levelColors](level.toUpperCase())}`;
    },
    time: (inputData: string | object) => {
      const inputDateTime =
        typeof inputData === 'string' ? inputData : new Date().toISOString();
      // const dateTime = formatDate(inputDateTime, DATETIME_FORMAT.DEFAULT);
      const date = formatDate(inputDateTime, DATE_FORMAT.DEFAULT);
      const time = formatDate(inputDateTime, TIME_FORMAT.DEFAULT);

      return `${chalk.gray(date)} | ${chalk.white(time)}`;
    },
  },
  ignore: 'pid,reqId,hostname',
  // ignore: 'time,pid,reqId,responseTime,hostname,req,res,err,level',
  levelFirst: true,
  translateTime: DATETIME_FORMAT.DEFAULT,
};
