export const toUpperCaseFirst = (str = ''): string =>
  str?.charAt(0).toUpperCase() + str?.slice(1) || '';
export const toUpperCaseFirstRGX = (str = ''): string =>
  str.replace(/\b[a-z]/gi, (match) => match.toUpperCase());

/**
 * Returns a new string in title case
 * TODO: should lowercase rest of word ??
 * @param {string} str string to modify
 */

export function toTitleCase(str: string): string {
  return (
    str
      .split(' ')
      // .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  );
}

/**
 * Returns a new string in sentence case with spaces added, from camel source
 * @param {string} str string to modify
 */

export function camelCaseToSentence(str: string): string {
  const strWithSpaces = str.replace(/([A-Z])/g, ' $1');
  const strFinal = strWithSpaces.charAt(0).toUpperCase() + strWithSpaces.slice(1);

  return strFinal;
}

/**
 * Returns a new cleaned and formatted string for labels and titles
 * @param {string} labelOriginal string to format
 */

export function formatLabelString(labelOriginal: string): string {
  if (!labelOriginal) return ''; // TODO: FIX FOR EDGE-CASE - PASS `field` AND USE `name` AS FALLBACK

  // SPECIAL-CASE EXCEPTIONS
  if (labelOriginal === 'url') return labelOriginal.toUpperCase();

  // DEFAULT AUTO-FORMATTING
  let formatted = labelOriginal;
  // formatted = camelCaseToSentence(labelOriginal);
  formatted = formatted.replace(
    /_\d+/,
    (indexedLabel) => `_${Number(indexedLabel.match(/\d+/)) + 1}`,
  );
  formatted = formatted.replace(/-/g, ' ');
  formatted = formatted.replace(/_/g, ' ');
  // formatted = formatted.replace(/\b[a-zA-Z]/g, (match) => match.toUpperCase());
  formatted = formatted.replace('Url', (match) => match.toUpperCase());
  formatted = formatted.replace('Id', (match) => match.toUpperCase());

  return formatted;
}

/**
 * Returns a new cleaned and formatted "slug" string for use in URLs
 * @param {string} str string to format to slug
 * @param {boolean} [isUnderscored] string to format to slug
 * @param {boolean} [isFilename] string to format to slug
 */

export function slugify(str = '', args: any = {}): string {
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
}

/**
 * Returns a new cleaned and formatted string for labels and titles
 * @param {string} labelOriginal string to format
 */

export function unslugify(labelOriginal = ''): string {
  // SPECIAL-CASE EXCEPTIONS
  if (labelOriginal === 'url') return labelOriginal.toUpperCase();

  // DEFAULT AUTO-FORMATTING
  let formatted = labelOriginal;
  formatted = camelCaseToSentence(labelOriginal);
  formatted = formatted.replace(
    /_\d+/,
    (indexedLabel) => `_${Number(indexedLabel.match(/\d+/)) + 1}`,
  );
  formatted = formatted.replace(/-/g, ' ');
  formatted = formatted.replace(/_/g, ' ');
  formatted = formatted.replace(/\b[a-z]/gi, (match) => match.toUpperCase());
  formatted = formatted.replace('Url', (match) => match.toUpperCase());

  return formatted;
}

export function reverseString(str: string): string {
  return str === '' ? '' : reverseString(str.substring(1)) + str.charAt(0);
}
