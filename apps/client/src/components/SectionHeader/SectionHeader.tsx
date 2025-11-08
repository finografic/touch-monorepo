import React from 'react';

import { Box, Heading, Text } from '@radix-ui/themes';
import type { Responsive } from '@radix-ui/themes/dist/esm/props/prop-def.js';
import clsx from 'clsx';

import { styles } from './SectionHeader.styles';

interface SectionHeaderProps {
  title?: string;
  description?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  align?: Responsive<'left' | 'center' | 'right'>;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  headingLevel = 2,
  align = 'left',
  className,
}) => {
  return (
    <Box className={clsx('section-header', className)} css={styles}>
      {title && (
        <Heading
          className="section-title"
          as={`h${headingLevel}`}
          size="5"
          weight="bold"
          mt={description ? '2rem' : undefined}
          mb={description ? '2rem' : undefined}
          align={align}
        >
          {title}
        </Heading>
      )}
      {description && (
        <Text className="section-description" align={align}>
          {description}
        </Text>
      )}
    </Box>
  );
};
