import { format, lastDayOfMonth, parseISO } from 'date-fns';

import { DATE_FILTER, DATETIME_FORMAT } from 'i18n/datetime';
import { ES } from 'i18n/locale';
import type { DateRange } from 'types/date.types';
import { camelCaseToSentence, toTitleCase } from './string-format.utils';

// CHAR-COUNTS FOR SPLICING FULL DATE-STRING
// const lengthDateDefault = 10; // YYYY-MM-DD
const lengthDateTimeDefault = 20; // YYYY-MM-DD HH:mm:ss -OR- YYYY-MM-DDTHH:mm:ss
// const lengthDateHTML = 10; // YYYY-MM-DD (for HTML input[type="date"])
// const lengthDateTimeHTML = 16; // YYYY-MM-DDTHH:mm (for HTML input[type="datetime-local"])
// const lengthDateISO = 25; // YYYY-MM-DDTHH:mm:ss.SSSZ

export const getTimeStamp = () => Number((new Date().getTime() / 1000).toFixed());

// ==================================================================== //

export function isDate(value: any) {
  if (typeof value === 'object') {
    const objectType = Object.prototype.toString.call(value);
    if (objectType === '[object Date]') return true;
  }

  return false;
}

export const getMonthStart = (date: any) => format(date, `${DATE_FILTER.MONTH}-01`);
export const getMonthEnd = (date: any) => format(lastDayOfMonth(date), DATE_FILTER.DEFAULT);

// ============================================================== //

export function formatDate(
  date: number | string | Date,
  formatSkeleton: string = DATE_FILTER.DEFAULT,
  optionsOverrides = {},
): string {
  if (!date || (typeof date === 'string' && date === '')) return '';
  const dateObj = isDate(date) ? (date as Date) : date ? new Date(date) : new Date();
  const defaultOptions = {};
  const options = {
    ...defaultOptions,
    ...optionsOverrides,
    locale: ES,
  };

  const formatted = format(dateObj, formatSkeleton, options);

  return toTitleCase(formatted);
}

export function formatDateRange(
  dateRange: DateRange<string>,
  formatSkeleton: string = DATE_FILTER.DEFAULT,
  optionsOverrides = {},
): DateRange<string> {
  const defaultOptions = {};
  const options = {
    ...defaultOptions,
    ...optionsOverrides,
    locale: ES,
  };

  return {
    startDate: formatDate(dateRange.startDate, formatSkeleton, options),
    endDate: formatDate(dateRange.endDate, formatSkeleton, options),
  };
}

// ============================================================== //

export function getDateTimeString(date: string | Date): string {
  if (typeof date === 'object') date = date.toISOString();
  return date.substring(0, DATETIME_FORMAT.DEFAULT.length || lengthDateTimeDefault);
}

// ============================================================== //

export function formatDateLocal(date: string | number | Date): string {
  const dateTime = typeof date === 'number' ? new Date(date) : new Date(getDateTimeString(date));
  const dateFormatted = format(dateTime, DATETIME_FORMAT.MED, { locale: ES });

  return camelCaseToSentence(dateFormatted);
}

// ==================================================================== //

export function adjustForUTCOffset(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

// THEN, EXAMPLE ONLY (??) - stackoverflow
export function formatDateV1(dateString: string) {
  const date = parseISO(dateString);
  const dateWithOffset = adjustForUTCOffset(date);
  return format(dateWithOffset, 'LLL dd, yyyy HH:mm');
}

// ==================================================================== //

// OTHER SUGGESTION - USE NATIVE DATE ONLY (??)

// const date = new Date('2019-10-25T08:10:00Z');
// const isoDate = date.toISOString();
// console.log(`${isoDate.substring(0, 10)} ${isoDate.substring(11, 8)}`);
