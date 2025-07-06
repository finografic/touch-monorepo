import React from 'react';
import { Box, Text } from '@radix-ui/themes';
import type { FieldError } from 'react-hook-form';

interface FieldWrapperProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  error?: FieldError;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  required = false,
  children,
  className,
  style,
  error,
}) => {
  return (
    <Box style={{ position: 'relative', minWidth: '180px', ...style }} className={className}>
      {label && (
        <Text size="2" mb="2" weight="medium" className="field-label">
          {label} {required && '*'}
        </Text>
      )}
      {children}
      {error && (
        <Box style={{ position: 'relative', minWidth: '180px', ...style }}>
          <Text size="1" color="red" mt="1">
            {error.message}
          </Text>
        </Box>
      )}
    </Box>
  );
};
