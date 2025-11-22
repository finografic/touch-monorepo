// @ts-nocheck
// Integration Example: Co-existence with existing i18next system
// File: apps/client/src/admin/AdminDashboardPage.tsx

import { useAppConfig } from '@workspace/core';
import { getMessages } from '@workspace/i18n';
// import { useTranslation } from 'react-i18next'; // Keep for gradual migration

export const AdminDashboardPage = () => {
  const { currentLanguage } = useAppConfig();

  // New ParaglideJS-style messages (type-safe, zero runtime overhead)
  const messages = getMessages(currentLanguage);

  // Old i18next system (can coexist during migration)
  // const { t } = useTranslation();

  return (
    <div>
      {/* NEW: Type-safe message access */}
      <h1>{messages.admin.title}</h1>
      <p>{messages.admin.description}</p>

      {/* NEW: Nested messages with autocomplete */}
      <h2>{messages.admin.pages.dashboard.title}</h2>
      <p>{messages.admin.pages.dashboard.description}</p>

      {/* OLD: Can still use i18next for complex translations */}
      {/* <p>{t('admin.complex.dynamic.message', { count: 5 })}</p> */}

      {/* NEW: Simple, type-safe messages */}
      <div>
        <h3>{messages.admin.pages.translations.title}</h3>
        <p>{messages.admin.pages.translations.description}</p>
      </div>
    </div>
  );
};

// Migration Strategy:
// 1. Start with simple UI labels (like page titles)
// 2. Keep i18next for complex translations (pluralization, interpolation)
// 3. Gradually migrate more messages as you refactor components
// 4. Both systems can coexist indefinitely
