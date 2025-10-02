import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ColorBaseName } from 'styles';

/**
 * Button variants - clean and minimal set
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Button sizes - consistent with design system
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Available button colors from the design system
 */
export type ButtonColor = Extract<
  ColorBaseName,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'grey'
>;

/**
 * Icon position for buttons with both icon and text
 */
export type IconPosition = 'left' | 'right';

/**
 * Button Props Interface
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /**
   * Button variant - affects visual style
   * @default 'solid'
   */
  variant?: ButtonVariant;

  /**
   * Button color from design system
   * @default 'default'
   */
  color?: ButtonColor;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Icon to display in the button
   */
  icon?: ReactNode;

  /**
   * Position of the icon relative to text
   * @default 'left'
   */
  iconPosition?: IconPosition;

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Make button full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button content - can be text or other elements
   */
  children?: ReactNode;
}
