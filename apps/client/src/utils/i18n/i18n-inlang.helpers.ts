import type { AuthRoles } from 'admin/config/admin.routes.map';
import { getMessageTexts } from 'utils/i18n/i18n-inlang.utils';

interface GetItemTextProps {
  key: string;
  role: AuthRoles;
}

export const getAdminNavItemText = ({ key, role }: GetItemTextProps) => {
  return getMessageTexts(['admin', key], { elements: ['card', 'title'], role }).title;
};

export const getAdminPageTexts = ({ key, role }: GetItemTextProps) => {
  return getMessageTexts(['admin', key], {
    elements: ['title', 'description'],
    role,
  });
};

export const getAdminCalloutTexts = ({ key, role }: GetItemTextProps) => {
  return getMessageTexts(['admin', key], {
    elements: ['title', 'description'],
    role,
  });
};
