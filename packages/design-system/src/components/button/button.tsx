/**
 * Button Component
 *
 * Accessible button built on `ark.button`. Styling via `buttonRecipe`
 * — pass `className={buttonRecipe({ variant, colorScheme, size })}`.
 *
 * Usage:
 * ```tsx
 * import { Button } from '@workspace/design-system/components';
 * import { buttonRecipe } from '@workspace/design-system/recipes';
 *
 * <Button className={buttonRecipe({ variant: 'solid', colorScheme: 'primary' })}>
 *   Save
 * </Button>
 * ```
 */
import { ark } from '@ark-ui/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import type { ButtonVariants } from './button.types';

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonVariants & {
    /** Visual size — xs · sm · md · lg · xl. Default: md */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Visual variant — solid · subtle · outline · ghost · link. Default: outline */
    variant?: 'solid' | 'subtle' | 'outline' | 'ghost' | 'link';
    /** Color scheme. Default: default */
    colorScheme?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'grey';
    /** Loading state — disables the button and sets aria-busy */
    loading?: boolean;
    /** Icon element rendered before children (or after, see iconPosition) */
    icon?: ReactNode;
    /** Position of the icon relative to text content. Default: left */
    iconPosition?: 'left' | 'right';
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'md',
      variant = 'outline',
      colorScheme = 'default',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <ark.button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-size={size}
        data-variant={variant}
        data-color-scheme={colorScheme}
        data-loading={loading || undefined}
        className={className}
        {...props}
      >
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </ark.button>
    );
  },
);

Button.displayName = 'Button';
