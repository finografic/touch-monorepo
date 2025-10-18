import type { ReactNode } from 'react';
import React, { memo } from 'react';

import type { SerializedStyles } from '@emotion/react';
import { Callout, Heading, Text } from '@radix-ui/themes';
import clsx from 'clsx';

import { type Align, STATUS_TO_CALLOUT_COLOR, type StatusType } from 'types/ui.types';

interface AdminContentLayoutProps {
  title: string;
  detail?: string;
  subtitle?: string;
  description?: string;
  align?: Align;
  children: ReactNode;
  message?: {
    type: StatusType;
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  css?: SerializedStyles;
}

export const AdminContentLayout: React.FC<AdminContentLayoutProps> = memo(
  ({ title, subtitle, description, align = 'left', children, message, isLoading = false, error, css }) => {
    return (
      <section css={css} className="admin-page-container">
        <header className={clsx('admin-page-header', { [align]: align })}>
          <Heading size="8" className="admin-page-title" align={align} mb="1rem">
            {title}
            {subtitle && <span style={{ opacity: 0.5 }}> : {subtitle}</span>}
          </Heading>
          {description && (
            <div className="admin-page-description">
              XX<Text>{description}</Text>
            </div>
          )}
        </header>

        {/* Status Messages */}
        {error && (
          <Callout.Root color="red" style={{ marginBottom: '1.5rem' }}>
            <Callout.Text>Error: {error}</Callout.Text>
          </Callout.Root>
        )}

        {message && (
          <Callout.Root
            color={STATUS_TO_CALLOUT_COLOR[message.type]}
            className="admin-page-message"
            style={{ marginBottom: '1.5rem' }}
          >
            <Callout.Text>{message.content}</Callout.Text>
          </Callout.Root>
        )}

        {/* Page Content */}
        <div className="admin-page-content">{children}</div>
      </section>
    );
  },
);
