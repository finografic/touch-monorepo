import type { cca2Codes } from './cca2.constants';
import type { languages, supportedLanguages } from './langs.constants';

export type LiteralUnion<T> = T | (string & {});
export type Code = Cca2Code;

export type CountryPicker<T extends readonly (keyof Country)[]> = Pick<Country, T[number]>;

export type SupportedLanguages = (typeof supportedLanguages)[number];
export type Cca2Code = LiteralUnion<(typeof cca2Codes)[number]>;
export type Lang = LiteralUnion<(typeof languages)[number]>;

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  languages?: Record<string, string>;
  flag?: string;
  flags: { png: string; svg: string; alt?: string };
}
