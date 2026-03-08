import type { ReactElement } from 'react';
import { forwardRef } from 'react';

import clsx from 'clsx';
import { getVariantStyles } from 'components/Button/utils/button.utils';

import type { ButtonProps } from './Button.types';
import { LoadingSpinner } from './LoadingSpinner';
import { baseButtonStyles, fullWidthStyles, sizeStyles } from './Button.styles';

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
    const VARIANT_STYLES = getVariantStyles(variant, color);
    const sizeStyle = sizeStyles[size];
    const isDisabled = disabled || loading;

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

    const spinnerSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

    const renderIcon = () => {
      if (!icon) return null;
      return <span className={`button-icon button-icon-${iconPosition} size--${size}`}>{icon}</span>;
    };

    const renderContent = () => {
      if (loading) {
        return <LoadingSpinner size={spinnerSize} />;
      }

      if (icon && !children) {
        return renderIcon();
      }

      if (icon && children) {
        return (
          <>
            {iconPosition === 'left' && renderIcon()}
            <span className={`button-text button-icon-${iconPosition}`}>{children}</span>
            {iconPosition === 'right' && renderIcon()}
          </>
        );
      }

      return <span className={'button-text'}>{children}</span>;
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
        css={[baseButtonStyles, sizeStyle, fullWidth && fullWidthStyles, VARIANT_STYLES]}
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
