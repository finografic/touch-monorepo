import React from 'react';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import { isPagesTableGroup } from '../../../shared/constants/translationsTable.constants';
import type { TranslationsFormItem } from '../../../shared/types/translations.types';
import type { UserRoleDisplayConfig } from '../utils/roles.utils';
import { DividerRowByDomain } from './DividerRowByDomain';
import { DividerRowByPage } from './DividerRowByPage';

interface TranslationsGroupRowOptions {
  domain: I18nTranslationsDomain;
  group: string;
  items: TranslationsFormItem[];
  fields: TranslationsFormItem[];
  index: number;
  fieldKey: string;
  supportedLanguages: RegionLocale[];
  showKeyColumn: boolean;
  pageGrouping: Map<number, string> | null;
  domainSubGrouping?: Map<number, string> | null;
  rows: React.ReactNode[];
  userRole?: UserRoleDisplayConfig;
}

/**
 * Pushes divider rows into `rows` before the current field when a new page group
 * or domain sub-group starts. No-op for non-pages groups.
 */
export const addTranslationsGroupRow = ({
  domain,
  group,
  items,
  fields,
  index,
  fieldKey,
  supportedLanguages,
  showKeyColumn,
  pageGrouping,
  domainSubGrouping,
  rows,
  userRole,
}: TranslationsGroupRowOptions): void => {
  if (!isPagesTableGroup(group) || !domain || !pageGrouping) return;

  const currentPage = pageGrouping.get(index);
  const previousPage = index > 0 ? pageGrouping.get(index - 1) : null;

  if (currentPage && currentPage !== previousPage && currentPage !== '_other') {
    rows.push(
      <DividerRowByPage
        key={`divider-${currentPage}-${fieldKey}`}
        pageName={currentPage}
        domain={domain}
        supportedLanguages={supportedLanguages}
        showKeyColumn={showKeyColumn}
        userRole={userRole}
      />,
    );
  }

  if (domainSubGrouping) {
    const currentDomainGroup = domainSubGrouping.get(index) ?? null;
    const previousDomainGroup = index > 0 ? (domainSubGrouping.get(index - 1) ?? null) : null;

    if (currentDomainGroup && currentDomainGroup !== previousDomainGroup) {
      const separatorIndex = currentDomainGroup.indexOf(':::');
      const pageName = currentDomainGroup.slice(0, separatorIndex);
      const segment = currentDomainGroup.slice(separatorIndex + 3);

      rows.push(
        <DividerRowByDomain
          key={`domain-divider-${currentDomainGroup}-${fieldKey}`}
          domain={domain}
          pageName={pageName}
          segment={segment}
          supportedLanguages={supportedLanguages}
          showKeyColumn={showKeyColumn}
          userRole={userRole}
        />,
      );
    }
  }
};

/** Maps each field index to the page segment name extracted from its translation key. */
export const computePageGrouping = (
  hasGrouping: boolean,
  items: TranslationsFormItem[],
  fields: TranslationsFormItem[],
): Map<number, string> | null => {
  if (!hasGrouping) return null;

  const fieldIndexToPage = new Map<number, string>();

  items.forEach((item) => {
    const fieldIndex = fields.findIndex((field) => field.id === item.id || field.key === item.key);
    if (fieldIndex === -1) return;

    const keyParts = item.key.split('.');
    const pagesIndex = keyParts.indexOf('pages');
    if (pagesIndex >= 0 && pagesIndex < keyParts.length - 1 && !fieldIndexToPage.has(fieldIndex)) {
      fieldIndexToPage.set(fieldIndex, keyParts[pagesIndex + 1]);
    }
  });

  return fieldIndexToPage;
};
