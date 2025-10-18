import React from 'react';

import { styles } from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'dark' | 'light';
}

export const Input: React.FC<InputProps> = ({ variant = 'light', ...props }) => {
  return <input css={styles.input(variant)} {...props} />;
};
