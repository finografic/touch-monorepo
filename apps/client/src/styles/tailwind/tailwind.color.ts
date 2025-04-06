import ColorConstructor from 'color';
import type { ColorName, HexColor, ShadeKey } from 'styles/colors.types';
import { SHADE_PREFIX } from '../palette.contants';

// NOTE: USED BY TailwindCSS
/**
 * Generate color variants using Color.js lightening/darkening
 * Uses a shade configuration object to determine how to transform each shade
 */
export const generateTWColorVariants = ({
  color,
  name,
  shadeConfig,
}: {
  color: ColorConstructor;
  name: ColorName;
  shadeConfig: ShadeConfig;
}) => {
  const variants = {} as { [key in ColorName]: string };
  variants[name] = color.hex();

  Object.entries(shadeConfig).forEach(([shadeKey, factors]) => {
    if (!factors || Object.keys(factors).length === 0) {
      // console.log(`Skipping shade key ${shadeKey} - no transformation factors`);
      return;
    }

    let colorVariant = ColorConstructor(color.hex());
    const luminosity = colorVariant.luminosity();

    if ('mix' in factors && factors.mix) {
      colorVariant = colorVariant.mix(ColorConstructor(factors.mix.color), factors.mix.amount);
    }

    if ('lighten' in factors && factors.lighten !== undefined) {
      if (factors.lighten > 0.5) {
        const mixAmount = factors.lighten;
        colorVariant = colorVariant.mix(ColorConstructor('#ffffff'), mixAmount);
      } else {
        colorVariant = colorVariant.lighten(factors.lighten);
      }
    }

    if ('desaturate' in factors && factors.desaturate !== undefined) {
      colorVariant = colorVariant.desaturate(factors.desaturate);
    }

    if ('darken' in factors && factors.darken !== undefined) {
      if (factors.darken > 0.5) {
        const mixAmount = factors.darken;
        colorVariant = colorVariant.mix(ColorConstructor('#000000'), mixAmount);
      } else {
        colorVariant = colorVariant.darken(factors.darken);
      }
    }

    if ('saturate' in factors && factors.saturate !== undefined) {
      colorVariant = colorVariant.saturate(factors.saturate);
    }

    const hexValue = colorVariant.hex();
    const shadeKeySuffix =
      (shadeKey as ShadeKey) in SHADE_PREFIX ? SHADE_PREFIX[shadeKey as ShadeKey] : shadeKey;

    const variantKey = `${name}${shadeKeySuffix}`;
    variants[variantKey] = hexValue;
  });

  return variants;
};

// Type for shade configuration
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
