import type { ReactNode } from 'react';
import React, { memo } from 'react';

import { Flex } from '@radix-ui/themes';
import { Title } from 'components/Title';

import { styles } from './AdminPageHeader.styles';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
}

/**
 * AdminPageHeader - Reusable header for admin pages with action buttons
 *
 * Provides a consistent header layout across admin pages with:
 * - Title component on the left (using shared styling)
 * - Action buttons on the right
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
  ({ title, subtitle, description, actions, size = '6' }) => {
    return (
      <header css={styles} className="admin-page-header">
        <Flex justify="between" align="center" gap="4" wrap="wrap">
          {/* Left side: Title Component (50%) */}
          <Flex className="admin-page-header-left" style={{ flex: '1 1 50%' }}>
            <Title
              title={title}
              subtitle={subtitle}
              description={description}
              className="admin-page-header-title"
            />
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
