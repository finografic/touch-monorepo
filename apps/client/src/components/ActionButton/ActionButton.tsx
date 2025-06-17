import clsx from 'clsx';
import { forwardRef } from 'react';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import type { ActionButtonProps } from 'types/button.types';
import { actionButtonStyles } from './ActionButton.styles';

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ id, label, className, icon, disabled, onClick, children, type, actionType, ...htmlProps }, ref) => {
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        css={actionButtonStyles}
        className={clsx(
          className,
          icon === 'chevron-left' && 'has-chevron has-chevron-left',
          icon === 'chevron-right' && 'has-chevron has-chevron-right',
        )}
        onClick={onClick}
        disabled={disabled}
        data-disabled={disabled ? 'true' : undefined}
        {...htmlProps}
      >
        {icon === 'chevron-left' && <DoubleArrowLeftIcon />}
        {children || label}
        {icon === 'chevron-right' && <DoubleArrowRightIcon />}
      </button>
    );
  },
);

ActionButton.displayName = 'ActionButton';
