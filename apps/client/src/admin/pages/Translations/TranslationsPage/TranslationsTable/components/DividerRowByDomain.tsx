import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/config/i18n.config';

import { appendRoleLabelToPageTitle, type UserRoleDisplayConfig } from '../utils/roles.utils';

interface DomainGroupDividerRowProps {
  domain: string;
  pageName: string;
  segment: string;
  supportedLanguages: RegionLocale[];
  showKeyColumn: boolean;
  userRole?: UserRoleDisplayConfig;
}

/**
 * Sub-group divider row for `domains.{segment}.*` proxy groups within a page.
 * Visually lighter than the page-level DividerRowByPage.
 *
 * Title is resolved from `{domain}.pages.{pageName}.domains.{segment}.title`,
 * falling back to the raw segment name. Role label (`(admin)` / `(public)`) is
 * appended when `userRole.display` is true, using `userRole.default` as the
 * fallback role (domain sub-group segments never carry an explicit `_public` /
 * `_admin` suffix).
 */
export const DividerRowByDomain: React.FC<DomainGroupDividerRowProps> = ({
  domain,
  pageName,
  segment,
  supportedLanguages,
  showKeyColumn,
  userRole,
}) => {
  const { t } = useTranslation();
  const baseTitle = t(`${domain}.pages.${pageName}.domains.${segment}.title`, {
    defaultValue: segment,
  });
  const title = appendRoleLabelToPageTitle({ pageTitle: baseTitle, pageSegment: segment, userRole });

  return (
    <>
      {!showKeyColumn && (
        <tr className="group-header group-header--domain group-header-no-key">
          <td className="col-divider-title" colSpan={supportedLanguages.length + 2}>
            {title}
          </td>
        </tr>
      )}
      <tr className="group-header group-header--domain">
        <td className="col-key col-divider-title">{title}</td>
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
