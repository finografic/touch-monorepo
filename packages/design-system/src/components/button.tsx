/**
 * Button Component
 *
 * Typed wrapper around ark.button. Provides the React interface;
 * styling comes from `buttonRecipe` applied via `className`.
 *
 * Usage:
 * ```tsx
 * import { Button } from '@workspace/design-system/components';
 * import { buttonRecipe } from '@workspace/design-system/recipes'; // generated in consuming app
 *
 * <Button
 *   className={buttonRecipe({ variant: 'solid', colorScheme: 'primary', size: 'md' })}
 *   onClick={handleSave}
 * >
 *   <SaveIcon />
 *   Save
 * </Button>
 * ```
 *
 * Icon-only button (use aria-label):
 * ```tsx
 * <Button
 *   className={buttonRecipe({ variant: 'ghost', size: 'sm' })}
 *   aria-label="Delete row"
 * >
 *   <TrashIcon />
 * </Button>
 * ```
 */
import { ark } from '@ark-ui/react';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
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
}

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
