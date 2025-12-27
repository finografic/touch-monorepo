import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getAdminNavItemsByRole } from 'admin/config/admin.routes.selectors';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { getAdminNavItemText } from 'utils/i18n/i18n-inlang.helpers';

import { AdminNavbar } from 'admin/components/AdminNavigation/AdminNavbar';
import { styles } from 'admin/components/AdminNavigation/AdminNavWrapper.styles';

export const AdminNavWrapper: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  // Get navigation items from the same source as AdminNavigation
  const navItems = useMemo(() => {
    return getAdminNavItemsByRole(user?.role).flatMap((item) => {
      if (item.id === 'translations' && item.children && item.children.length > 0) {
        return item.children.map((child) => {
          // Extract domain from child ID (e.g., "translationsUi" -> "ui", "translationsApp" -> "app")
          // or from path (e.g., "/admin/translations/ui" -> "ui")
          let domain: string | undefined;

          if (child.id.startsWith('translations')) {
            // Extract domain from ID: "translationsUi" -> "ui"
            domain = child.id.replace(/^translations/i, '').toLowerCase();
          } else if (child.path) {
            // Extract domain from path: "/admin/translations/ui" -> "ui"
            const pathMatch = child.path.match(/\/translations\/([^/]+)/);
            domain = pathMatch?.[1];
          }

          return {
            id: child.id,
            path: child.path || '',
            label: domain
              ? t(`admin.pages.translations.domains.${domain}.title`)
              : getAdminNavItemText({ key: child.id, role: user?.role }),
          };
        });
      }

      return [
        {
          id: item.id,
          path: item.path || '',
          label: t(`admin.pages.${item.id}.title`),
        },
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, user?.role, location.pathname]);

  return (
    <div css={styles}>
      <AdminNavbar navItems={navItems} />
    </div>
  );
};
