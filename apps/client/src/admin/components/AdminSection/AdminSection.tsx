import type { ReactNode } from 'react';
import React, { memo } from 'react';

import clsx from 'clsx';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

import { styles } from './AdminSection.styles';

interface AdminSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'border-solid' | 'border-dashed' | 'none';
  isLoading?: boolean;
}

export const AdminSection: React.FC<AdminSectionProps> = memo(
  ({ title, subtitle, description, children, className = '', variant = 'none', isLoading = false }) => {
    return (
      <div
        css={styles}
        className={clsx('admin-section', className, { 'is-loading': isLoading })}
        // TODO: INVESTIGATE TABS HIDDEN..
        // style={{ overflowY: className.includes('tab-content-list') ? 'scroll' : 'hidden' }}
      >
        <div className={clsx('admin-section-content', { 'border-solid': variant === 'border-solid' })}>
          {(title || description) && (
            <SectionHeader title={title} subtitle={subtitle} description={description} />
          )}
          {children}
        </div>
      </div>
    );
  },
);
