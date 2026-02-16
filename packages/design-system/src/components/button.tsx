/**
 * Button Component
 *
 * Ark UI primitive + Panda CSS recipe.
 * Accessible by default (keyboard, focus management, disabled states).
 *
 * Usage:
 * ```tsx
 * import { Button } from '@workspace/design-system/components';
 *
 * <Button variant="solid" size="md" onClick={handleClick}>
 *   <PlusIcon />
 *   Add Column
 * </Button>
 * ```
 */
import { ark } from '@ark-ui/react';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual size */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost';
  /** Color scheme */
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** Loading state — disables button and shows loading indicator */
  loading?: boolean;
}

/**
 * Button — wraps ark.button with design system recipe classes.
 *
 * NOTE: The `className` prop is where Panda CSS recipe output goes.
 * In a Panda CSS setup, you'd use:
 *   `className={button({ size: 'md', variant: 'solid' })}`
 *
 * This component provides the React interface. The actual className
 * generation happens at the consuming app level via Panda's codegen.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'md', variant = 'outline', colorScheme, loading, disabled, children, className, ...props }, ref) => {
    return (
      <ark.button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={className}
        data-size={size}
        data-variant={variant}
        data-color-scheme={colorScheme}
        {...props}
      >
        {children}
      </ark.button>
    );
  },
);

Button.displayName = 'Button';
