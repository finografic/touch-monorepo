import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getAdminNavItemsByRole } from 'admin/config/admin.routes.selectors';
import { useAuth } from 'providers/AuthProvider/AuthContext';

import { AdminNavbar } from 'admin/components/AdminNavigation/AdminNavbar';
import { styles } from 'admin/components/AdminNavigation/AdminNavWrapper.styles';

export const AdminNavWrapper: FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  /**
   * Used purely to force recomputation of nav labels when
   * translations are reloaded or language changes.
   */
  const [translationVersion, bumpTranslationVersion] = useState(0);
  const lastLanguageRef = useRef(i18n.language);

  useEffect(
    function handleI18nChangeEffects() {
      function handleLanguageChanged() {
        if (lastLanguageRef.current !== i18n.language) {
          lastLanguageRef.current = i18n.language;
          bumpTranslationVersion((v) => v + 1);
        }
      }

      function handleResourcesReloaded() {
        bumpTranslationVersion((v) => v + 1);
      }

      i18n.on('languageChanged', handleLanguageChanged);
      i18n.on('loaded', handleResourcesReloaded);

      return () => {
        i18n.off('languageChanged', handleLanguageChanged);
        i18n.off('loaded', handleResourcesReloaded);
      };
    },
    [i18n],
  );

  const navItems = useMemo(() => {
    return getAdminNavItemsByRole(user?.role).flatMap((item) => {
      // Special handling for grouped translations nav
      if (item.id === 'translations' && item.children?.length) {
        return item.children.map((child) => {
          const domain =
            child.path?.match(/\/translations\/([^/]+)/)?.[1] ??
            child.id.replace(/^translations/i, '').toLowerCase();

          return {
            id: child.id,
            path: child.path ?? '',
            label: t(`admin.pages.translations.domains.${domain}.title`),
          };
        });
      }

      return [
        {
          id: item.id,
          path: item.path ?? '',
          label: t(`admin.pages.${item.id}.title`),
        },
      ];
    });
  }, [t, user?.role, location.pathname, translationVersion]);

  return (
    <div css={styles}>
      <AdminNavbar navItems={navItems} />
    </div>
  );
};
