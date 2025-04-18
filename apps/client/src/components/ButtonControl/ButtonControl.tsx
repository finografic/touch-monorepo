import { styles } from './ButtonControl.styles';
import { FC } from 'react';

type ButtonControlProps = {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export const ButtonControl: FC<ButtonControlProps> = ({ className, disabled = false, onClick, children }) => {
  // const classNames = [...new Set(['btn-control', className].filter(Boolean))].join(' ');

  return (
    <button css={styles} className={`btn ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
