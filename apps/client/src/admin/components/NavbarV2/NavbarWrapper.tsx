import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getAdminNavItemsByRole } from 'admin/config/admin.routes.selectors';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { getAdminNavItemText } from 'utils/i18n/i18n-inlang.helpers';

import Navbar from 'admin/components/NavbarV2/Navbar';
import { styles } from 'admin/components/NavbarV2/NavbarWrapper.styles';

export default function NavbarWrapper() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  // Get navigation items from the same source as AdminNavigation
  const navItems = useMemo(() => {
    return getAdminNavItemsByRole(user?.role).flatMap((item) => {
      // For translations item, expand children into separate nav items
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

      // For all other items, return as regular nav item (no children)
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
      <Navbar navItems={navItems} />
    </div>
  );
}
