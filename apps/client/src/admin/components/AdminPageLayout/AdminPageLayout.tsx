import type { ReactNode } from 'react';
import React, { memo } from 'react';

import type { SerializedStyles } from '@emotion/react';
import { Flex } from 'styled-system/jsx';
import { callout } from 'styled-system/recipes';
import { Loader } from 'components/Loader/Loader';
import { Title } from 'components/Title';

import type { Align, StatusType } from 'types/ui.types';
import { styles as stylesLayout } from './AdminPageLayout.styles';

const STATUS_TO_CALLOUT_STATUS: Record<StatusType, 'error' | 'warning' | 'success' | 'info'> = {
  error: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info',
};

interface AdminPageLayoutProps {
  title?: string;
  subtitle?: string;
  description?: string;
  align?: Align;
  headerActions?: ReactNode;
  children: ReactNode;
  message?: {
    type: StatusType;
    content: string;
  };
  isLoading?: boolean;
  error?: string;
  styles?: SerializedStyles;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = memo(
  ({
    title,
    subtitle,
    description,
    align = 'left',
    headerActions,
    children,
    message,
    isLoading = false,
    error,
    styles,
  }) => {
    const showHeader = title || subtitle || description || headerActions;

    return (
      <section css={[stylesLayout, styles]} className="container admin-page-container">
        {showHeader && (
          <header className="admin-page-header">
            <Flex justify="space-between" align="center" gap="4">
              {/* Left side: Title - Flexible width */}
              <Flex className="admin-page-header-left" style={{ flex: '1 1 auto', minWidth: 0 }}>
                <Title
                  title={title}
                  subtitle={subtitle}
                  description={description}
                  align={align}
                  className="admin-page-header-title"
                  as="div"
                />
              </Flex>
              {/* Right side: Action Buttons - Flexible but no wrap */}
              {headerActions && (
                <Flex className="admin-page-header-actions" align="center" justify="end" gap="3" style={{}}>
                  {headerActions}
                </Flex>
              )}
            </Flex>
          </header>
        )}

        {isLoading ? (
          <Flex direction="column" className="admin-page-content" gap="2">
            <Loader message="Loading..." />
          </Flex>
        ) : (
          <>
            {error && (
              <div className={callout({ status: 'error' })} role="alert" style={{ marginBottom: '1.5rem' }}>
                <span>Error: {error}</span>
              </div>
            )}
            {message && (
              <div
                className={`${callout({ status: STATUS_TO_CALLOUT_STATUS[message.type] })} admin-page-message`}
                role="alert"
                style={{ marginBottom: '1.5rem' }}
              >
                <span>{message.content}</span>
              </div>
            )}
            <Flex direction="column" className="admin-page-content" gap="2">
              {isLoading || error ? null : children}
            </Flex>
          </>
        )}
      </section>
    );
  },
);
