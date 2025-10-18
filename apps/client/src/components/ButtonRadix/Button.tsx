import React from 'react';

import type { ButtonProps as RadixButtonProps } from '@radix-ui/themes';
import { Button as RadixButton } from '@radix-ui/themes';

import type { colorVariables } from './Button.styles';

import { getButtonStyles } from './Button.styles';

type OmittedRadixProps = 'color' | 'variant';

export interface ButtonProps extends Omit<RadixButtonProps, OmittedRadixProps> {
  color?: keyof typeof colorVariables;
  variant?: keyof typeof colorVariables.success;
}

export const Button: React.FC<ButtonProps> = ({
  color = 'default',
  variant = 'solid',
  css: cssProp,
  ...props
}) => {
  return <RadixButton {...props} css={[getButtonStyles(variant, color), cssProp]} />;
};
