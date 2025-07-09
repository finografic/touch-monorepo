import type { ReactNode } from 'react';
import React, { memo } from 'react';
import { Callout, Heading, Text } from '@radix-ui/themes';

interface AdminContentLayoutProps {
  title: string;
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
  ({ title, subtitle, children, message, isLoading = false, error, centerTitle = false }) => {
    return (
      <section className="admin-page">
        <div className="admin-page-container">
          <div
            className={`admin-page-header ${centerTitle ? 'centered' : ''}`}
            style={centerTitle ? { textAlign: 'center' } : {}}
          >
            <Heading size="8" className="admin-page-title" align={centerTitle ? 'center' : 'left'}>
              {title}
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

/**
 * Admin Section Component
 * Use for grouped content within admin pages
 */
interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const AdminSection: React.FC<AdminSectionProps> = memo(
  ({ title, description, children, className = '' }) => {
    return (
      <div className={`admin-section ${className}`}>
        {(title || description) && (
          <div className="section-header">
            {title && <h3 className="section-title">{title}</h3>}
            {description && <p className="section-description">{description}</p>}
          </div>
        )}
        <div className="section-content">{children}</div>
      </div>
    );
  },
);
