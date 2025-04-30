import Color from 'color';
import type { ColorMapping, ColorName, HexColor, ShadeKey } from 'styles/colors.types';
import { SHADE_PREFIX } from 'styles/palette.contants';
import type { ColorBaseName, ColorPalette } from '../palette.types';

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

const COLOR_SHADES: ShadeConfig = {
  xxlight: { mix: { color: '#ffffff', amount: 0.78 }, saturate: 0.85 },
  xlight: { mix: { color: '#ffffff', amount: 0.66 }, saturate: 0.0 },
  light: { mix: { color: '#ffffff', amount: 0.4 }, saturate: 0.5 },
  base: {},
  dark: { mix: { color: '#000000', amount: 0.2 }, saturate: 0.1 },
  xdark: { mix: { color: '#000000', amount: 0.4 }, saturate: 0.15 },
  xxdark: { mix: { color: '#000000', amount: 0.6 }, saturate: 0.2 },
} as const;

/**
 * Generate color variants using Color.js lightening/darkening
 * Uses a shade configuration object to determine how to transform each shade
 */
export const generatePaletteColorVariants = ({
  color,
  name,
  shadeConfig,
}: {
  color: HexColor;
  name: ColorName;
  shadeConfig: ShadeConfig;
}) => {
  const variants = {} as { [key in ColorName]: string };
  variants[name] = Color(color).hex();

  Object.entries(shadeConfig).forEach(([shadeKey, factors]) => {
    if (!factors || Object.keys(factors).length === 0) {
      // console.log(`Skipping shade key ${shadeKey} - no transformation factors`);
      return;
    }

    let colorVariant = Color(Color(color).hex());
    // const luminosity = colorVariant.luminosity();

    if ('mix' in factors && factors.mix) {
      colorVariant = colorVariant.mix(Color(factors.mix.color), factors.mix.amount);
    }

    if ('lighten' in factors && factors.lighten !== undefined) {
      if (factors.lighten > 0.5) {
        const mixAmount = factors.lighten;
        colorVariant = colorVariant.mix(Color('#ffffff'), mixAmount);
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
        colorVariant = colorVariant.mix(Color('#000000'), mixAmount);
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
    variants[variantKey as ColorName] = hexValue;
  });

  return variants;
};

export const generateColorPalette = ({
  colors,
}: {
  colors: Omit<ColorMapping, 'white' | 'black' | 'background'>;
}) => {
  const palette = {} as ColorPalette;

  for (const [name, { value }] of Object.entries(colors) as [ColorBaseName, { value: HexColor }][]) {
    try {
      Object.assign(palette, {
        ...generatePaletteColorVariants({
          name,
          color: value,
          shadeConfig: COLOR_SHADES,
        }),
      });
    } catch (error) {
      console.error(`Error generating color variants for ${name}:`, error);
    }
  }

  return palette;
};
