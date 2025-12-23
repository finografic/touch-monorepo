import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/config/i18n.config';

interface PageDividerRowProps {
  pageName: string;
  domain: string;
  supportedLanguages: RegionLocale[];
}

/**
 * Non-interactive divider row that displays a page title to visually separate page sections
 */
export const PageDividerRow: React.FC<PageDividerRowProps> = ({ pageName, domain, supportedLanguages }) => {
  const { t } = useTranslation();

  // Get the translated page title
  // Translation key format: {domain}.pages.{pageName}.title
  // e.g., admin.pages.dashboard.title, app.pages.main.title
  const pageTitle = t(`${domain}.pages.${pageName}.title`);

  return (
    <tr className="page-divider-row">
      <td colSpan={supportedLanguages.length + 2} className="page-divider-cell">
        {pageTitle}
      </td>
    </tr>
  );
};

