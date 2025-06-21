import flagsData from './languages/flags.data.json';
import type { IsoCode } from '@workspace/types';

/**
 * Helper function to get flag data by ISO code
 */
export const getFlagDataByIso = (isoCode: IsoCode) => {
  return flagsData.find((flag) => flag.flags.png.includes(`/${isoCode.toLowerCase()}.png`));
};
