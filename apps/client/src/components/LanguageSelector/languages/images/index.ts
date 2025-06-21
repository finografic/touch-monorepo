import enUSFlag from './en-US.png';
import enGBFlag from './en-GB.png';
import esESFlag from './es-ES.png';
import catESFlag from './cat-ES.png';

export const flagAssets = {
  'en-US': enUSFlag,
  'en-GB': enGBFlag,
  'es-ES': esESFlag,
  'cat-ES': catESFlag,
} as const;

export type FlagCode = keyof typeof flagAssets;
