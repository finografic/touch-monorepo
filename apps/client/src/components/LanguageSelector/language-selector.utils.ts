import flagsData from './languages/languages.data.min.json';
import type { CCA2 } from '@workspace/types';

/**
 * Helper function to get flag data by ISO code
 */
export const getFlagDataByIso = (isoCode: CCA2) => {
  return flagsData.find((flag) => flag.flags.png.includes(`/${isoCode.toLowerCase()}.png`));
};
