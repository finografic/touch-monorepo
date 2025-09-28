import { type ReactElement, type ReactNode, useMemo } from 'react';
import type { ButtonProps } from './Button.types';
import { css } from '@emotion/react';
import { styles } from './Button.styles';
import { getColorsByVariant, getStylesByIconScale } from './getButtonStyles';
import clsx from 'clsx';

const Button = ({
  type = 'button',
  variant = 'solid',
  color = 'primaryDark',
  colorHover = color,
  colorLabel,
  isDisabled = false,
  fullWidth = false,
  label,
  icon,
  iconPos = 'left',
  iconScale = 1.5,
  size = 'md',
  isBusy,
  padded: isPadded = true,
  className,
  children,
  ...props
}: ButtonProps): ReactElement => {
  const isIconOnly: boolean = !!icon && !label;

  const mergedClassNames = useMemo(
    () =>
      clsx('btn', `btn-${color}`, `btn-${variant}`, `size-${size}`, className, {
        'full-width': fullWidth,
        'icon-only': isIconOnly,
        'icon-left': iconPos === 'left',
        'icon-right': iconPos === 'right',
        'btn-padded': isPadded && !isIconOnly,
      }),
    [color, variant, size, className, fullWidth, isPadded, iconPos, isIconOnly],
  );

  const stylesByProps = useMemo(
    () => css`
      ${styles}
      ${getColorsByVariant({ color, colorHover, colorLabel, variant })}
      ${getStylesByIconScale({ iconScale })}
    `,
    [color, variant, colorHover, colorLabel, iconScale, styles],
  );

  const buttonContent = isIconOnly ? (
    <>{typeof icon === 'function' ? icon({}) : icon}</>
  ) : (
    <>
      {icon && (!iconPos || iconPos === 'left') && (typeof icon === 'function' ? icon({}) : icon)}
      {label && <span>{label}</span>}
      {icon && iconPos === 'right' && (typeof icon === 'function' ? icon({}) : icon)}
    </>
  );

  return (
    <button
      type={type}
      aria-label={label}
      className={mergedClassNames}
      css={stylesByProps}
      disabled={isDisabled}
      {...props}
    >
      {children ?? buttonContent}
    </button>
  );
};

export { Button };
