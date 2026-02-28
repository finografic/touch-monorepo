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
        backgroundColor: 'var(--color-panel-solid)',
        border: '1px solid var(--gray-6)',
        borderRadius: '8px',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        marginTop: 'var(--space-2)',
      }}
    >
      {(title || description) && (
        <Box mb="4">
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
