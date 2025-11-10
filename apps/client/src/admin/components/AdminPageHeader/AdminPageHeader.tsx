import type { ReactNode } from 'react';
import React, { memo } from 'react';

import { Flex, Heading, Text } from '@radix-ui/themes';

import { styles } from './AdminPageHeader.styles';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * AdminPageHeader - Reusable header for admin pages with action buttons
 *
 * Provides a consistent header layout across admin pages with:
 * - Title and optional subtitle on the left (50% width)
 * - Action buttons on the right (50% width)
 *
 * @example
 * // List page with "Create New" button
 * <AdminPageHeader
 *   title="Gestión de configuraciones"
 *   subtitle="318 entries"
 *   actions={
 *     <Button onClick={() => navigate('/admin/items/new')}>
 *       + Create New
 *     </Button>
 *   }
 * />
 *
 * @example
 * // Edit page with Cancel/Save buttons
 * <AdminPageHeader
 *   title="Editar registro"
 *   subtitle="1"
 *   actions={
 *     <>
 *       <Button onClick={onCancel}>Cancelar</Button>
 *       <Button onClick={onSave} loading={isLoading}>
 *         CONFIRM CHANGES
 *       </Button>
 *     </>
 *   }
 * />
 */
export const AdminPageHeader: React.FC<AdminPageHeaderProps> = memo(
  ({ title, subtitle, description, actions }) => {
    return (
      <header css={styles} className="admin-page-header">
        <Flex justify="between" align="center" gap="4" wrap="wrap">
          {/* Left side: Title & Subtitle (50%) */}
          <Flex direction="column" gap="1" className="admin-page-header-left" style={{ flex: '1 1 50%' }}>
            <Flex align="baseline" gap="3">
              <Heading size="7" as="h1" className="admin-page-header-title">
                {title}
              </Heading>
              {subtitle && (
                <Text size="5" color="gray" className="admin-page-header-subtitle">
                  : {subtitle}
                </Text>
              )}
            </Flex>
            {description && (
              <Text size="2" color="gray" className="admin-page-header-description">
                {description}
              </Text>
            )}
          </Flex>

          {/* Right side: Action Buttons (50%) */}
          {actions && (
            <Flex
              gap="3"
              align="center"
              justify="end"
              className="admin-page-header-actions"
              style={{ flex: '1 1 50%' }}
            >
              {actions}
            </Flex>
          )}
        </Flex>
      </header>
    );
  },
);

AdminPageHeader.displayName = 'AdminPageHeader';

