import { useTranslation } from 'react-i18next';
import type { RegionLocale } from '@workspace/config/i18n.config';

interface PageDividerRowProps {
  pageName: string;
  domain: string;
  supportedLanguages: RegionLocale[];
  showKeyColumn: boolean;
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
}: PageDividerRowProps) => {
  const { t } = useTranslation();

  // Get the translated page title
  // Translation key format: {domain}.pages.{pageName}.title
  // e.g., admin.pages.dashboard.title, app.pages.main.title
  const pageTitle = t(`${domain}.pages.${pageName}.title`);

  return (
    <>
      {!showKeyColumn && (
        <tr className="group-header group-header-no-key">
          <td className="col-divider-title" colSpan={supportedLanguages.length + 2}>
            {pageTitle}
            {/* <span style={{ opacity: 0.5, paddingLeft: '10px' }}>{`${domain}.pages.${pageName}.title`}</span> */}
          </td>
        </tr>
      )}
      <tr className="group-header">
        <td className="col-key col-divider-title">{pageTitle}</td>
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
