import type { TFunction } from 'i18next';
import type { AuthRoles } from 'admin/config/admin.routes.map';

interface GetAdminNavItemTextParams {
  t: TFunction;
  key: string;
  role?: AuthRoles;
}

/**
 * Returns a role-aware admin navigation label.
 *
 * Resolution order:
 * 1. pages.{key}_{role}.title
 * 2. pages.{key}.title
 * 3. key (last-resort fallback)
 */
export const getAdminNavItemText = ({ t, key, role = 'public' }: GetAdminNavItemTextParams): string => {
  const roleKey = `pages.${key}_${role}.title`;
  const baseKey = `pages.${key}.title`;

  return t(roleKey, {
    defaultValue: t(baseKey, {
      defaultValue: key,
    }),
  });
};
