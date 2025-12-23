import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/config/i18n.config';

interface PageDividerRowProps {
  pageName: string;
  domain: string;
  supportedLanguages: RegionLocale[];
}

/**
 * Non-interactive divider row that displays a page title to visually separate page sections
 * Also displays language codes to match the table header structure
 */
export const PageDividerRow: React.FC<PageDividerRowProps> = ({ pageName, domain, supportedLanguages }) => {
  const { t } = useTranslation();

  // Get the translated page title
  // Translation key format: {domain}.pages.{pageName}.title
  // e.g., admin.pages.dashboard.title, app.pages.main.title
  const pageTitle = t(`${domain}.pages.${pageName}.title`);

  return (
    <tr className="group-header">
      <td className="col-divider-title">{pageTitle}</td>
      {supportedLanguages.map((lang) => (
        <td key={lang} className="col-divider-language">
          {lang}
        </td>
      ))}
      <td></td>
    </tr>
  );
};
