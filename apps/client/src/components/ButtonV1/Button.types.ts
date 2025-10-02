import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { ColorBaseName, ColorName, HexColor } from 'styles';
import type { IconType } from 'styles/icons';
import type { ConstEnumOf } from '@workspace/core/types/utils';
import type { SizeUI } from 'types/ui.types';

export const BUTTON_TYPE = {
  SUBMIT: 'submit',
  RESET: 'reset',
  BUTTON: 'button',
} as const satisfies ConstEnumOf<HTMLButtonElement['type']>;

export type ButtonType = (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];

export type ButtonVariant = 'outline' | 'clear' | 'icon' | 'solid';

export type ButtonColorVariant = Extract<
  ColorBaseName,
  'default' | 'info' | 'success' | 'warning' | 'danger'
>;

/**
 * Available button colors from the design system
 */
export type ButtonColor = Extract<
  ColorBaseName,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'grey' | 'gray'
>;

export const BUTTON_COLOR_VARIANT: ConstEnumOf<ButtonColorVariant> = {
  DEFAULT: 'default',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
} as const;

export type IconPos = 'left' | 'right';

export interface ButtonProps {
  children?: any;
  className?: string;
  // color?: ColorName | HexColor;
  color?: ButtonColor;
  // colorHover?: string;
  colorHover?: ColorName | HexColor;
  colorLabel?: ColorName | HexColor;
  icon?: ReactNode | IconType;
  iconPos?: IconPos;
  iconScale?: number;
  isBusy?: boolean;
  isDisabled?: boolean;
  key?: number;
  label?: string;
  id?: string;
  onClick?: ((evt?: any) => void) | undefined;
  // onClick: () => void;
  size?: SizeUI;
  fullWidth?: boolean;
  padded?: boolean;
  type?: ButtonType;
  variant?: ButtonVariant;
  style?: CSSProperties;
}

export interface ButtonLinkProps extends ButtonProps {
  to: string;
  state?: {
    [key: string]: string | number | boolean;
  };
  label?: string;
}
