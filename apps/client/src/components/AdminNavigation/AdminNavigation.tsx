import React from 'react';
import { TabNav } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin',
    },
    {
      id: 'translations',
      label: t('admin.pages.translations.title'),
      path: '/admin/translations',
    },
    {
      id: 'ui-labels',
      label: 'UI Labels / Translations',
      path: '/admin/ui-labels',
    },
    {
      id: 'languages',
      label: t('admin.pages.languages.title'),
      path: '/admin/languages',
    },
    {
      id: ' ',
      label: t('admin.pages.orders.title'),
      path: '/admin/orders',
    },
  ];

  return (
    <div css={styles}>
      <TabNav.Root size="2" className="admin-nav">
        {navItems.map((item) => (
          <TabNav.Link
            key={item.id}
            href={item.path}
            active={location.pathname === item.path}
            style={{
              color: location.pathname === item.path ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'transparent',
              fontWeight: location.pathname === item.path ? '600' : '400',
            }}
          >
            {item.label}
          </TabNav.Link>
        ))}
      </TabNav.Root>
    </div>
  );
};
