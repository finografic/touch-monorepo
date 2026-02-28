import React from 'react';

import clsx from 'clsx';

import { styles } from './SectionHeader.styles';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
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
        <h2 className="section-header-title">
          {title}
          {subtitle && <span className="title-subtitle"> : {subtitle}</span>}
        </h2>
      )}
      {description && (
        <span className="section-header-description">
          {description}
        </span>
      )}
    </div>
  );
};
