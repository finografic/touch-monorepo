import type { ReactNode } from 'react';
import React, { memo } from 'react';

import type { SerializedStyles } from '@emotion/react';
import { Callout, Flex } from '@radix-ui/themes';
import { Title } from 'components/Title';

import { type Align, STATUS_TO_CALLOUT_COLOR, type StatusType } from 'types/ui.types';
import { styles as stylesLayout } from './AdminPageLayout.styles';
import { Loader } from 'components/Loader/Loader';

interface AdminPageLayoutProps {
  title?: string;
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
  styles?: SerializedStyles;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = memo(
  ({ title, subtitle, description, align = 'left', children, message, isLoading = false, error, styles }) => {
    return (
      <section css={[stylesLayout, styles]} className="container admin-page-container">
        <Title
          className="admin-page-title"
          title={title}
          subtitle={subtitle}
          size="7"
          as="h1"
          mb="2"
          description={description}
          align={align}
        />

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

        <Flex direction="column" className="admin-page-content">
          {isLoading || error ? null : children}
        </Flex>
      </section>
    );
  },
);
