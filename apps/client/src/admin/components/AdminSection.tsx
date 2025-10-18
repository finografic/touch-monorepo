import type { ReactNode } from 'react';
import React, { memo } from 'react';

import { Flex } from '@radix-ui/themes';
import clsx from 'clsx';

import { SectionHeader } from 'components/SectionHeader/SectionHeader';

interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'border-solid' | 'border-dashed' | 'none';
}

export const AdminSection: React.FC<AdminSectionProps> = memo(
  ({ title, description, children, className = '', variant = 'none' }) => {
    return (
      <div className={clsx('admin-section', className)}>
        {(title || description) && <SectionHeader title={title} description={description} />}
        <div className="section-content">
          {variant !== 'none' ? (
            <Flex direction="column" gap="4">
              <div
                style={{
                  padding: '1rem',
                  border: variant === 'border-solid' ? '1px solid #e2e8f0' : '1px dashed transparent',
                  // border: variant === 'border-solid' ? '1px solid red' : '1px dashed orange',
                  // border: variant === 'border-solid' ? '1px solid red' : '1px dashed orange',
                  borderRadius: '8px',
                }}
              >
                {children}
              </div>
            </Flex>
          ) : (
            children
          )}
        </div>
      </div>
    );
  },
);
