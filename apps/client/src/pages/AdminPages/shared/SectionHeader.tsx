import React from 'react';
import { Box, Heading, Text } from '@radix-ui/themes';

interface SectionHeaderProps {
  title: string;
  description?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  headingLevel = 2,
  className,
}) => {
  return (
    <Box className={className} mb="4">
      <Heading as={`h${headingLevel}` as any} size="5" weight="bold" mb={description ? '2' : undefined}>
        {title}
      </Heading>
      {description && (
        <Text size="2" color="gray">
          {description}
        </Text>
      )}
    </Box>
  );
};
