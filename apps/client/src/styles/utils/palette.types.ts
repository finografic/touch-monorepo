import type { HexColor, ShadeKey } from '../colors.types';

export type ShadeConfig = {
  [key in ShadeKey]?: {
    lighten?: number;
    desaturate?: number;
    darken?: number;
    saturate?: number;
    mix?: {
      color: HexColor;
      amount: number;
    };
  };
};
