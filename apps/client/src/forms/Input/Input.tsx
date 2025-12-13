import React, { forwardRef } from 'react';
import { styles } from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'dark' | 'light';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ variant = 'light', ...props }, ref) => {
  return <input ref={ref} css={styles.input(variant)} {...props} />;
});

Input.displayName = 'Input';
