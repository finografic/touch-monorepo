import type { ReactNode } from 'react';
import React, { memo } from 'react';

import type { SerializedStyles } from '@emotion/react';
import { Callout, Flex } from '@radix-ui/themes';
import { Loader } from 'components/Loader/Loader';
import { Title } from 'components/Title';

import { type Align, STATUS_TO_CALLOUT_COLOR, type StatusType } from 'types/ui.types';
import { styles as stylesLayout } from './AdminPageLayout.styles';

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
        {/* Page Header - Integrated AdminPageHeader */}
        {showHeader && (
          <header className="admin-page-header">
            <Flex justify="between" align="center" gap="4">
              {/* Left side: Title - Flexible width */}
              <Flex className="admin-page-header-left" style={{ flex: '1 1 auto', minWidth: 0 }}>
                <Title
                  title={title}
                  subtitle={subtitle}
                  description={description}
                  className="admin-page-header-title"
                  as="div"
                />
              </Flex>

              {/* Right side: Action Buttons - Flexible but no wrap */}
              {headerActions && (
                <Flex
                  gap="3"
                  align="center"
                  justify="end"
                  className="admin-page-header-actions"
                  style={{ flex: '0 0 auto' }}
                >
                  {headerActions}
                </Flex>
              )}
            </Flex>
          </header>
        )}

        {isLoading ? <Loader message="Loading..." /> : null}

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

        <Flex direction="column" className="admin-page-content" gap="2">
          {isLoading || error ? null : children}
        </Flex>
      </section>
    );
  },
);
