import { forwardRef } from 'react';

import clsx from 'clsx';
import type { ReactElement } from 'react';

import type { ButtonProps } from './Button.types';
import { LoadingSpinner } from './LoadingSpinner';
import { baseButtonStyles, fullWidthStyles, getVariantStyles, sizeStyles } from './Button.styles';

/**
 * Button - Modern, accessible button component
 *
 * Features:
 * - Clean API with minimal props
 * - Integrated with design system colors
 * - Proper accessibility attributes
 * - Loading states with spinner
 * - Multiple variants and sizes
 * - Icon support with positioning
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'default',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ): ReactElement => {
    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Generate styles
    const variantStyles = getVariantStyles(variant, color);
    const sizeStyle = sizeStyles[size];

    // Build class names using clsx
    const buttonClasses = clsx(
      'button',
      `button--${variant}`,
      `button--${color}`,
      `button--${size}`,
      {
        'button--full-width': fullWidth,
        'button--loading': loading,
        'button--icon-only': icon && !children,
      },
      className,
    );

    // Determine spinner size based on button size
    const spinnerSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

    // Render icon if provided
    const renderIcon = () => {
      if (!icon) return null;
      return <span className="button__icon">{icon}</span>;
    };

    // Render content with proper icon positioning
    const renderContent = () => {
      if (loading) {
        return <LoadingSpinner size={spinnerSize} />;
      }

      if (icon && !children) {
        // Icon-only button
        return renderIcon();
      }

      if (icon && children) {
        // Button with both icon and text
        return (
          <>
            {iconPosition === 'left' && renderIcon()}
            <span className="button__text">{children}</span>
            {iconPosition === 'right' && renderIcon()}
          </>
        );
      }

      // Text-only button
      return <span className="button__text">{children}</span>;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        data-loading={loading}
        data-variant={variant}
        data-color={color}
        data-size={size}
        className={buttonClasses}
        css={[baseButtonStyles, sizeStyle, variantStyles, fullWidth && fullWidthStyles]}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...rest}
      >
        {renderContent()}
      </button>
    );
  },
);

Button.displayName = 'Button';
