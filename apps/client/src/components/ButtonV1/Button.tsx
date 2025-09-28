import type { ReactElement } from 'react';
import type { ButtonProps } from './Button.types';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { ArrayJSX } from 'utils/ArrayJSX';
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
  // DIMENSIONS, PADDING ETC...
  const isIconOnly: boolean = !!icon && !label;

  // CSS CLASSES
  const cssClasses = new ArrayJSX('btn');
  cssClasses.push(`btn-${color}`);
  cssClasses.push(`btn-${variant}`);
  cssClasses.push(`size-${size}`);
  className && cssClasses.push(className);
  fullWidth && cssClasses.push('full-width');

  if (isIconOnly) {
    cssClasses.push('icon-only');
  } else {
    iconPos && cssClasses.push(iconPos);
    isPadded && cssClasses.push('btn-padded');
  }

  const buttonContent = isIconOnly ? (
    // Pass empty props object to icon component
    <>{typeof icon === 'function' ? icon({}) : icon}</>
  ) : (
    <>
      {icon && (!iconPos || iconPos === 'left') && (typeof icon === 'function' ? icon({}) : icon)}
      {label && <span>{label}</span>}
      {icon && iconPos === 'right' && (typeof icon === 'function' ? icon({}) : icon)}
    </>
  );

  const stylesByProps = css`
    ${styles}
    ${getColorsByVariant({ color, colorHover, colorLabel, variant })}
    ${getStylesByIconScale({ iconScale })}
  `;

  return (
    <button
      type={type}
      aria-label={label}
      className={cssClasses.inline()}
      css={stylesByProps}
      disabled={isDisabled}
      {...props}
    >
      {children ?? buttonContent}
    </button>
  );
};

export { Button };
