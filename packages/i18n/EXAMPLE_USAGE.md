// Example usage in your admin page
// Replace this in your AdminDashboardPage.tsx:

📅 Oct 18, 2025


import { useParaglideMessages } from '@workspace/i18n';

export const AdminDashboardPage = () => {
  // Instead of: const { t } = useTranslation();
  const messages = useParaglideMessages();

  return (
    <div>
      {/* Instead of: <h1>{t('admin.title')}</h1> */}
      <h1>{messages.admin.title}</h1>

      {/* Instead of: <p>{t('admin.description')}</p> */}
      <p>{messages.admin.description}</p>

      {/* Nested messages work the same way */}
      <h2>{messages.admin.pages.dashboard.title}</h2>
      <p>{messages.admin.pages.dashboard.description}</p>
    </div>
  );
};
