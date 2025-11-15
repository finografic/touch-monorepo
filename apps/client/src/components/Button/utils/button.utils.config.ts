import type { ButtonColor } from '../Button.types';
import type { ButtonColorVariants } from './button.utils.types';

/**
 * Base color mapping for each ButtonColor
 * Each value is the color key (e.g., 'primaryLight') that will be used as the base for variant calculations
 * Variants will be derived by shifting shades relative to this base
 */
export const BUTTON_BASE_COLORS: Record<ButtonColor, ButtonColorVariants> = {
  primary: 'primaryLight',
  secondary: 'secondaryLight',
  success: 'success',
  warning: 'warning',
  danger: 'dangerLight',
  // danger: 'danger',
  info: 'infoLight',
  default: 'greyLight',
  grey: 'greyLight',
};
