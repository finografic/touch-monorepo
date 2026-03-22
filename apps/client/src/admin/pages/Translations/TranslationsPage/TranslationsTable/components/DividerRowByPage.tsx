import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/config/i18n.config';

import { appendRoleLabelToPageTitle, type UserRoleDisplayConfig } from '../utils/roles.utils';

interface PageDividerRowProps {
  pageName: string;
  domain: string;
  supportedLanguages: RegionLocale[];
  showKeyColumn: boolean;
  userRole?: UserRoleDisplayConfig;
}

/**
 * Non-interactive divider row that displays a page title to visually separate page sections
 * Also displays language codes to match the table header structure
 */
export const DividerRowByPage: React.FC<PageDividerRowProps> = ({
  pageName,
  domain,
  supportedLanguages,
  showKeyColumn,
  userRole,
}: PageDividerRowProps) => {
  const { t } = useTranslation();

  // Translation key format: {domain}.pages.{pageName}.title
  // Role variants use a segment suffix, e.g. admin.pages.sound_public.title → pageName "sound_public"
  const pageTitle = t(`${domain}.pages.${pageName}.title`);
  const pageTitleWithRole = appendRoleLabelToPageTitle({
    pageTitle,
    pageSegment: pageName,
    userRole,
  });

  return (
    <>
      {!showKeyColumn && (
        <tr className="group-header group-header-no-key">
          <td className="col-divider-title" colSpan={supportedLanguages.length + 2}>
            {pageTitleWithRole}
            {/* <span style={{ opacity: 0.5, paddingLeft: '10px' }}>{`${domain}.pages.${pageName}.title`}</span> */}
          </td>
        </tr>
      )}
      <tr className="group-header">
        <td className="col-key col-divider-title">{pageTitleWithRole}</td>
        {supportedLanguages.map((lang) => (
          <td key={lang} className="col-divider-language">
            <span className="label-language">{lang}</span>
          </td>
        ))}
        <td className="col-actions"></td>
      </tr>
    </>
  );
};
