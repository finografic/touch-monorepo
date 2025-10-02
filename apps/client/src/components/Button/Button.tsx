import type { ReactElement } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ButtonProps } from './Button.types';
import { baseButtonStyles, fullWidthStyles, getVariantStyles, sizeStyles } from './Button.styles';
import { LoadingSpinner } from './LoadingSpinner';

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
      'btn',
      `btn--${variant}`,
      `btn--${color}`,
      `btn--${size}`,
      {
        'btn--full-width': fullWidth,
        'btn--loading': loading,
        'btn--icon-only': icon && !children,
      },
      className,
    );

    // Determine spinner size based on button size
    const spinnerSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

    // Render icon if provided
    const renderIcon = () => {
      if (!icon) return null;
      return <span className="btn__icon">{icon}</span>;
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
            <span className="btn__text">{children}</span>
            {iconPosition === 'right' && renderIcon()}
          </>
        );
      }

      // Text-only button
      return <span className="btn__text">{children}</span>;
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
