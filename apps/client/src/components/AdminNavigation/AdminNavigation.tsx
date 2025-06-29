import React, { startTransition } from 'react';
import { TabNav } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { usePageTransition } from 'hooks/usePageTransition';
import { styles } from './AdminNavigation.styles';

export const AdminNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 100 });

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
      id: 'orders-dev',
      label: t('admin.pages.orders.title'),
      path: '/admin/orders-dev',
    },
  ];

  const handleNavigation = (path: string) => {
    if (location.pathname === path) return; // Don't navigate if already on the page

    // Use startTransition for non-urgent navigation updates
    startTransition(() => {
      navigateWithTransition(path);
    });
  };

  return (
    <div css={styles}>
      <TabNav.Root size="2" className="admin-nav">
        {navItems.map((item) => (
          <TabNav.Link key={item.id} asChild active={location.pathname === item.path}>
            <button
              type="button"
              onClick={() => handleNavigation(item.path)}
              style={{
                color: location.pathname === item.path ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'transparent',
                fontWeight: location.pathname === item.path ? '600' : '400',
                border: 'none',
                cursor: isTransitioning ? 'wait' : 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                opacity: isTransitioning ? 0.7 : 1,
              }}
              disabled={isTransitioning}
            >
              {item.label}
            </button>
          </TabNav.Link>
        ))}
      </TabNav.Root>
    </div>
  );
};
