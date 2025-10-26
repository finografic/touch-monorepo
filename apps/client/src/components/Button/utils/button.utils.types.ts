import type { ButtonColor } from '../Button.types';
import type { ShadeVariant } from 'styles/colors/colors.types';

// export type ButtonColorVariants = ButtonColor | `${ButtonColor}${ShadeVariant}`;

export type ButtonColorVariants = `${ButtonColor}Light` | ButtonColor | `${ButtonColor}Dark`;
