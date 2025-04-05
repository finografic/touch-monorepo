// import type { RequestMethod } from 'types/request.types';
import chalk from 'chalk';
// import { REQUEST_COLOR } from 'types/cli.types';

const LINE_CHAR = '=';
const LINE_CHAR_THIN = '-';
const LINE_LENGTH = 80;

// CLI decorative strings: horizontal + vertical rules
const BR = '\n';
const HR = LINE_CHAR.repeat(LINE_LENGTH);
const HR_THIN = LINE_CHAR_THIN.repeat(LINE_LENGTH);
const SEPARATOR = chalk.grey.bold(' / ');

// function _colorizeMethod({ method }: { method: RequestMethod }) {
//   return chalk[REQUEST_COLOR[method]](`[${method}]`);
// }

// EXPORT THE FULL CLI SUITE
export const cli = {
  br: () => console.log(BR),
  hr: (weight?: 1 | 2) =>
    weight !== 2 ? console.log(HR_THIN) : console.log(HR),
  vr: () => console.log(SEPARATOR),
};

export const CLI = {
  BR,
  HR_1: chalk.grey(LINE_CHAR_THIN.repeat(LINE_LENGTH)),
  HR_2: chalk.grey(LINE_CHAR.repeat(LINE_LENGTH)),
  VR: chalk.grey(SEPARATOR),
  METHOD: {
    GET: chalk.green('[GET]'),
    POST: chalk.blue('[POST]'),
    PUT: chalk.yellow('[PUT]'),
    DELETE: chalk.red('[DELETE]'),
    OPTIONS: chalk.magenta('[OPTIONS]'),
  },
};
