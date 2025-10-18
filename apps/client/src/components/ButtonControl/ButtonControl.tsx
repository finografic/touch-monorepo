import type { FC, ReactNode } from 'react';

import { styles } from './ButtonControl.styles';

interface ButtonControlProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const ButtonControl: FC<ButtonControlProps> = ({ className, disabled = false, onClick, children }) => {
  // const classNames = [...new Set(['button-control', className].filter(Boolean))].join(' ');

  return (
    <button css={styles} className={`button ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
