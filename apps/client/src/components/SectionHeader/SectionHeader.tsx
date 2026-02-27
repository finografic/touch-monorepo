import React from 'react';

import { Heading, Text } from '@radix-ui/themes';
import type { Responsive } from '@radix-ui/themes/dist/esm/props/prop-def.js';
import clsx from 'clsx';

import { styles } from './SectionHeader.styles';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  align?: Responsive<'left' | 'center' | 'right'>;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  headingLevel = 2,
  align = 'left',
  className,
}) => {
  // TODO: USE Title.tsx ??
  // see: apps/client/src/admin/components/AdminPageLayout.tsx
  return (
    <div className={clsx('section-header', className)} css={styles}>
      {title && (
        <Heading
          className="section-header-title"
          as={`h${headingLevel}`}
          size="5"
          weight="bold"
          mt={description ? '2rem' : undefined}
          mb={description ? '2rem' : undefined}
          align={align}
        >
          {title}
          {subtitle && <span className="title-subtitle"> : {subtitle}</span>}
        </Heading>
      )}
      {description && (
        <Text size="3" weight="medium" className="section-header-description" align={align}>
          {description}
        </Text>
      )}
    </div>
  );
};
