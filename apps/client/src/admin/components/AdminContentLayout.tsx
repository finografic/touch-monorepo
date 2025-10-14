import type { ReactNode } from 'react';
import React, { memo } from 'react';
import { Callout, Heading, Text } from '@radix-ui/themes';
import type { SerializedStyles } from '@emotion/react';

interface AdminContentLayoutProps {
  title: string;
  detail?: string;
  subtitle?: string;
  description?: string;
  children: ReactNode;
  message?: {
    type: 'success' | 'error' | 'warning' | 'info';
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  centerTitle?: boolean;
  css?: SerializedStyles;
}

export const AdminContentLayout: React.FC<AdminContentLayoutProps> = memo(
  ({
    title,
    detail,
    subtitle,
    description,
    children,
    message,
    isLoading = false,
    error,
    centerTitle = false,
    css,
  }) => {
    return (
      <section css={css} className="admin-page-container">
        <header className={`admin-page-header ${centerTitle ? 'centered' : ''}`}>
          <Heading size="8" className="admin-page-title" align={centerTitle ? 'center' : 'left'}>
            {title}
            {subtitle && <span style={{ opacity: 0.5 }}> : {subtitle}</span>}
          </Heading>
          {description && (
            <div className="admin-page-description">
              <Text>{description}</Text>
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
            color={
              message.type === 'success'
                ? 'green'
                : message.type === 'error'
                  ? 'red'
                  : message.type === 'warning'
                    ? 'yellow'
                    : 'blue'
            }
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
