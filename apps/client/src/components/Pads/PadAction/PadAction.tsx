import { forwardRef } from 'react';

import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

import type { PadActionProps } from 'types/button.types';

import { stylesPadAction } from './PadAction.styles';

export const PadAction = forwardRef<HTMLButtonElement, PadActionProps>(
  ({ id, label, className, icon, disabled, onClick, children, type, actionType, ...htmlProps }, ref) => {
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        css={stylesPadAction}
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

PadAction.displayName = 'PadAction';
