import { styles } from './ButtonControl.styles';
import type { FC, ReactNode } from 'react';

interface ButtonControlProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const ButtonControl: FC<ButtonControlProps> = ({ className, disabled = false, onClick, children }) => {
  // const classNames = [...new Set(['btn-control', className].filter(Boolean))].join(' ');

  return (
    <button css={styles} className={`btn ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
