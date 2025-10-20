import type { ReactNode } from 'react';
import React, { memo } from 'react';

import clsx from 'clsx';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'border-solid' | 'border-dashed' | 'none';
  isLoading?: boolean;
}

export const AdminSection: React.FC<AdminSectionProps> = memo(
  ({ title, description, children, className = '', variant = 'none', isLoading = false }) => {
    return (
      <div
        className={clsx('admin-section', className, { 'is-loading': isLoading })}
        style={{ overflowY: className.includes('tab-content-list') ? 'scroll' : 'hidden' }}
      >
        {(title || description) && <SectionHeader title={title} description={description} />}
        <div className="section-content">
          {variant !== 'none' ? (
            <div
              style={{ border: variant === 'border-solid' ? '1px solid #e2e8f0' : '1px solid transparent' }}
            >
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
);
