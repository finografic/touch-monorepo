import React from 'react';
import { Button as RadixButton } from '@radix-ui/themes';
import type { ButtonProps as RadixButtonProps } from '@radix-ui/themes';
import { css } from '@emotion/react';
import { colors } from 'styles/colors.styles';

// Custom color system
const colorVariables = {
  success: {
    light: colors.successLight,
    base: colors.success,
    dark: colors.successDark,
  },
  warning: {
    light: colors.warningLight,
    // NOTE: COLOR USAGE..
    // - soft variant: background-color at 20% opacity
    // - surface variant: border-color
    // - outline/ghost variants: hover background at 10% opacity

    base: colors.warningDark,
    // NOTE: COLOR USAGE..
    // - solid variant: background-color
    // - soft variant: text color
    // - outline variant: border-color and text
    // - ghost variant: text color
    // - surface variant: text color

    dark: colors.warningDark,
    // NOTE: COLOR USAGE..
    // - solid variant: hover background
    // - soft variant: text color
    // - surface variant: hover border-color
    // - outline/ghost variants: text color and hover effects
  },
  danger: {
    light: colors.dangerLight,
    base: colors.danger,
    dark: colors.dangerDark,
  },
  info: {
    light: colors.infoLight,
    base: colors.info,
    dark: colors.infoDark,
  },
  default: {
    light: colors.greyLight,
    base: colors.grey,
    dark: colors.greyDark,
  },
} as const;

// Omit Radix's color and variant props that we want to override
type OmittedRadixProps = 'color' | 'variant';

export interface ButtonProps extends Omit<RadixButtonProps, OmittedRadixProps> {
  color?: keyof typeof colorVariables;
  variant?: 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
}

// Generate styles based on variant and color
const getButtonStyles = (
  variant: NonNullable<ButtonProps['variant']>,
  color: NonNullable<ButtonProps['color']>,
) => {
  const colorSet = colorVariables[color];

  const baseStyles = css`
    transition: all 0.2s ease;
  `;

  const variantStyles = {
    solid: css`
      background-color: ${colorSet.base};
      color: ${colors.white};
      &:hover {
        background-color: ${colorSet.dark};
      }
      &:disabled {
        background-color: ${colorSet.base};
        opacity: 0.5;
      }
    `,
    soft: css`
      background-color: ${colorSet.light}20;
      color: ${colorSet.dark};
      &:hover {
        background-color: ${colorSet.light}40;
      }
      &:disabled {
        opacity: 0.5;
      }
    `,
    surface: css`
      background-color: ${colors.white};
      color: ${colorSet.dark};
      border: 1px solid ${colorSet.light};
      &:hover {
        background-color: ${colorSet.light}10;
        border-color: ${colorSet.base};
      }
      &:disabled {
        opacity: 0.5;
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${colorSet.dark};
      border: 1px solid ${colorSet.base};
      &:hover {
        background-color: ${colorSet.light}10;
      }
      &:disabled {
        opacity: 0.5;
      }
    `,
    ghost: css`
      background-color: transparent;
      color: ${colorSet.dark};
      &:hover {
        background-color: ${colorSet.light}10;
      }
      &:disabled {
        opacity: 0.5;
      }
    `,
  };

  return css`
    ${baseStyles}
    ${variantStyles[variant]}
  `;
};

export const Button: React.FC<ButtonProps> = ({
  color = 'default',
  variant = 'solid',
  css: cssProp,
  ...props
}) => {
  return <RadixButton {...props} css={[getButtonStyles(variant, color), cssProp]} />;
};
