import React from 'react';
import { Box, Text } from '@radix-ui/themes';

interface FieldWrapperProps {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  required = false,
  children,
  className,
  style,
}) => {
  return (
    <Box style={{ position: 'relative', minWidth: '180px', ...style }} className={className}>
      {label && (
        <Text size="2" mb="2" weight="medium" className="field-label">
          {label} {required && '*'}
        </Text>
      )}
      {children}
    </Box>
  );
};
