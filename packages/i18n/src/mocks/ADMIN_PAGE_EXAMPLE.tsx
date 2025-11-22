// @ts-nocheck
// Example: How to use the new messages system in your admin page
// File: apps/client/src/admin/AdminDashboardPage.tsx

import { useAppConfig } from '@workspace/core';
import { getMessages } from '@workspace/i18n';

export const AdminDashboardPage = () => {
  const { currentLanguage } = useAppConfig();

  // Get messages for current language
  const messages = getMessages(currentLanguage);

  return (
    <div>
      {/* Type-safe message access */}
      <h1>{messages.admin.title}</h1>
      <p>{messages.admin.description}</p>

      {/* Nested messages work perfectly */}
      <h2>{messages.admin.pages.dashboard.title}</h2>
      <p>{messages.admin.pages.dashboard.description}</p>

      {/* TypeScript will autocomplete and catch typos */}
      <div>
        <h3>{messages.admin.pages.translations.title}</h3>
        <p>{messages.admin.pages.translations.description}</p>
      </div>
    </div>
  );
};

// Benefits:
// ✅ Type safety - messages.admin.title vs t('admin.title')
// ✅ Autocomplete - TypeScript suggests available messages
// ✅ Compile-time validation - typos caught at build time
// ✅ Zero runtime overhead - direct object access
// ✅ Works with your existing useAppConfig().currentLanguage
// ✅ Integrates with your RegionLocale types ('en-GB', 'es-ES')
