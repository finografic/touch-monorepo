/**
 * Returns a boolean
 * @param {string} value - to determine if String that is not empty ("")
 */

import { camelCaseToSentence } from './string-case.utils';

export const isNonEmptyString = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  if (value === '') return false;
  if (!value) return false;
  return true;
};

/**
 * Returns a new cleaned and formatted string for labels and titles
 * @param {string} labelOriginal string to format
 */

export const formatLabelString = (labelOriginal: string): string => {
  if (!labelOriginal) return ''; // TODO: FIX FOR EDGE-CASE - PASS `field` AND USE `name` AS FALLBACK

  // SPECIAL-CASE EXCEPTIONS
  if (labelOriginal === 'url') return labelOriginal.toUpperCase();

  // DEFAULT AUTO-FORMATTING
  let formatted = labelOriginal;
  // formatted = camelCaseToSentence(labelOriginal);
  formatted = formatted.replace(/_\d+/, (indexedLabel) => `_${Number(indexedLabel.match(/\d+/)) + 1}`);
  formatted = formatted.replace(/-/g, ' ');
  formatted = formatted.replace(/_/g, ' ');
  // formatted = formatted.replace(/\b[a-zA-Z]/g, (match) => match.toUpperCase());
  formatted = formatted.replace('Url', (match) => match.toUpperCase());
  formatted = formatted.replace('Id', (match) => match.toUpperCase());

  return formatted;
};

/**
 * Returns a new cleaned and formatted "slug" string for use in URLs
 * @param {string} str string to format to slug
 * @param {boolean} [isUnderscored] string to format to slug
 * @param {boolean} [isFilename] string to format to slug
 */

export const slugify = (str = '', args: any = {}): string => {
  str = str.toString().toLowerCase().trim();
  if (str.startsWith('/')) str = str.slice(1);

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');
  const strCleaned = str.replace(p, (c) => b.charAt(a.indexOf(c))); // Replace special characters

  /* eslint no-useless-escape: "off" */
  const SPACE_CHAR = args?.isUnderscored ? '_' : '-';

  const strNoSpaces = strCleaned
    .replace(/\s+/g, SPACE_CHAR) // Replace spaces with -
    .replace(/-{2,}/g, SPACE_CHAR) // Replace multiple - with single -
    .replace(/&/g, `${SPACE_CHAR}and${SPACE_CHAR}`); // Replace & with 'and'

  const slugified = args?.isFilename ? strNoSpaces : strNoSpaces.replace(/[^\w\-]+/g, '');

  return slugified;
};

/**
 * Returns a new cleaned and formatted string for labels and titles
 * @param {string} labelOriginal string to format
 */

export const unslugify = (labelOriginal = ''): string => {
  // DEFAULT AUTO-FORMATTING
  let formatted = labelOriginal;
  formatted = camelCaseToSentence(labelOriginal);
  formatted = formatted.replace(/_\d+/, (indexedLabel) => `_${Number(indexedLabel.match(/\d+/)) + 1}`);
  formatted = formatted.replace(/-/g, ' ');
  formatted = formatted.replace(/_/g, ' ');
  formatted = formatted.replace(/\b[a-z]/gi, (match) => match.toUpperCase());
  formatted = formatted.replace('Url', (match) => match.toUpperCase());

  return formatted;
};

export const reverseString = (str: string): string => {
  return str === '' ? '' : reverseString(str.substring(1)) + str.charAt(0);
};
