// Example: Using interpolation in AdminDashboardPage
import React from 'react';
import { formatDate, formatNumber, getMessages, interpolate, pluralize } from '@workspace/i18n';

import { useAppConfig } from 'providers/AppConfigProvider';
// Alternative: Create a custom hook for cleaner syntax
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider';

export const AdminDashboardPageWithInterpolation: React.FC = () => {
  const { currentLanguage } = useAppConfig();
  const { user } = useAuth();
  const messages = getMessages(currentLanguage);

  // Example data
  const orderCount = 5;
  const lastUpdate = new Date();

  return (
    <div>
      {/* Simple message */}
      <h1>{messages.admin.pages.dashboard.title}</h1>
      <p>{messages.admin.pages.dashboard.description}</p>

      {/* Interpolation - Welcome message with user name */}
      <h2>{interpolate(messages.admin.welcome, { name: user?.username || 'Guest' })}</h2>

      {/* Pluralization - Order count */}
      <p>{pluralize(orderCount, messages.admin.itemCount)}</p>

      {/* Combined interpolation + date formatting */}
      <p>
        {interpolate(messages.admin.lastUpdated, {
          date: formatDate(lastUpdate, currentLanguage, { dateStyle: 'medium' }),
        })}
      </p>
    </div>
  );
};

export function useMessages() {
  const { currentLanguage } = useAppConfig();
  const messages = getMessages(currentLanguage);

  return {
    messages,
    // Simple translation function like i18next's t()
    t: (message: string, params?: Record<string, any>) => {
      return params ? interpolate(message, params) : message;
    },
    plural: (count: number, forms: any) => pluralize(count, forms),
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, currentLanguage, options),
    date: (value: Date, options?: Intl.DateTimeFormatOptions) => formatDate(value, currentLanguage, options),
  };
}

// Usage with hook:
export const AdminDashboardPageWithHook: React.FC = () => {
  const { user } = useAuth();
  const { messages, t, plural, date } = useMessages();

  const orderCount = 5;
  const lastUpdate = new Date();

  return (
    <div>
      <h1>{messages.admin.pages.dashboard.title}</h1>

      {/* Interpolation */}
      <h2>{t(messages.admin.welcome, { name: user?.username || 'Guest' })}</h2>

      {/* Pluralization */}
      <p>{plural(orderCount, messages.admin.itemCount)}</p>

      {/* Date formatting with interpolation */}
      <p>
        {t(messages.admin.lastUpdated, {
          date: date(lastUpdate, { dateStyle: 'medium' }),
        })}
      </p>
    </div>
  );
};
