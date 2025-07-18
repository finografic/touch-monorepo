import type { ReactNode } from 'react';
import React, { memo } from 'react';
import { Callout, Heading, Text } from '@radix-ui/themes';

interface AdminContentLayoutProps {
  title: string;
  detail?: string;
  subtitle?: string;
  children: ReactNode;
  message?: {
    type: 'success' | 'error' | 'warning' | 'info';
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  centerTitle?: boolean;
}

export const AdminContentLayout: React.FC<AdminContentLayoutProps> = memo(
  ({ title, detail, subtitle, children, message, isLoading = false, error, centerTitle = false }) => {
    return (
      <section className="admin-page">
        <div className="admin-page-container">
          <div
            className={`admin-page-header ${centerTitle ? 'centered' : ''}`}
            style={centerTitle ? { textAlign: 'center' } : {}}
          >
            <Heading size="8" className="admin-page-title" align={centerTitle ? 'center' : 'left'}>
              {title}
              {detail && <span style={{ opacity: 0.5 }}> : {detail}</span>}
            </Heading>
            {subtitle && (
              <Text
                size="3"
                className="admin-page-subtitle"
                align={centerTitle ? 'center' : 'left'}
                style={centerTitle ? { textAlign: 'center' } : {}}
              >
                {subtitle}
              </Text>
            )}
          </div>

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
        </div>
      </section>
    );
  },
);
