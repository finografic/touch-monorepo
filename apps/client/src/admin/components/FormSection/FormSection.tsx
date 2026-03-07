import React, { type ReactNode } from 'react';

import { Box, Flex } from 'styled-system/jsx';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  headingLevel = 2,
}) => {
  const HeadingEl = `h${headingLevel}` as React.ElementType;

  return (
    <Box
      className={className}
      style={{
        backgroundColor: 'var(--colors-bg-panel)',
        border: '1px solid var(--colors-border)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        marginTop: '0.5rem',
      }}
    >
      {(title || description) && (
        <Box mb={4}>
          {title && (
            <HeadingEl>{title}</HeadingEl>
          )}
          {description && (
            <span>{description}</span>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};
