import clsx from 'clsx';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import type { ActionButtonProps } from 'types/navigation.types';
import { ActionButtonStyles } from './ActionButton.styles';

export const ActionButton = ({
  id,
  label,
  className,
  icon,
  disabled,
  onClick,
  children,
  type,
  actionType,
  ...htmlProps
}: ActionButtonProps) => {
  return (
    <button
      id={id}
      type="button"
      css={ActionButtonStyles}
      className={clsx(
        className,
        icon === 'chevron-left' && 'has-chevron',
        icon === 'chevron-right' && 'has-chevron-right',
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
};
