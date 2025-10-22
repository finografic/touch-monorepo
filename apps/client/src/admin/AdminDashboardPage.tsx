import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Flex } from '@radix-ui/themes';
import type { AuthRoles } from 'admin/config/admin.routes.map';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { NoAdminEntryRedirect } from 'admin/NoAdminEntryRedirect';
import { m } from 'src/paraglide/messages.js';
import { setLocale } from 'src/paraglide/runtime.js';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider';

import { usePageTransition } from 'hooks/usePageTransition';

import { getCalloutText } from './utils/i18n.utils';
import { AdminContentLayout } from '.';
import { styles } from './AdminDashboardPage.styles';

export const AdminDashboardPage: React.FC = () => {
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });

  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { currentLanguage } = useAppConfig();

  // Set ParaglideJS locale to match app's current language
  React.useEffect(() => {
    setLocale(currentLanguage as 'en-GB' | 'es-ES');
  }, [currentLanguage]);

  const role = user?.role === 'admin' ? 'admin' : 'public';

  // Use ParaglideJS `m` function with flat snake_case keys
  const dashboardTitle = m.admin_dashboard_title_role({ role });

  // Get dashboard cards for the current role
  const adminCards = React.useMemo(() => {
    return getAdminDashboardCards(isAuthenticated, role).map((card) => {
      const text = getCalloutText(t, role, card.key);
      return {
        id: card.key,
        title: text.title,
        description: text.description,
        icon: React.createElement(card.icon, { width: 32, height: 32 }),
        path: card.path,
        color: card.color,
      };
    });
  }, [isAuthenticated, role, t]);

  const handleCardClick = (path: string) => {
    navigateWithTransition(path);
  };

  // Calculate grid columns based on card count (max 2 columns for wider cards)
  const gridColumns = adminCards.length === 1 ? 1 : 2;

  console.log('🎴 Admin Dashboard:', {
    cardCount: adminCards.length,
    gridColumns,
    cards: adminCards.map((c) => c.id),
  });

  return (
    <AdminContentLayout title={dashboardTitle} subtitle={m.admin_dashboard_description()} align="center">
      <Box className="admin-dashboard" css={styles}>
        {/* <SectionHeader title="Admin Configuration" align="center" /> */}
        {/* <AdminAccessTest /> */}
        {/* <pre>{JSON.stringify(adminCards, null, 2)}</pre> */}
        <div className="admin-cards" style={{ ['--cols' as any]: gridColumns }}>
          {adminCards.map((card) => (
            <Card
              key={card.id}
              className="admin-card"
              size="3"
              variant="surface"
              onClick={() => handleCardClick(card.path)}
              style={{
                cursor: isTransitioning ? 'wait' : 'pointer',
                opacity: isTransitioning ? 0.7 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <Flex direction="row" gap="0" align="center" height="100%">
                <Box
                  className="card-icon-box"
                  style={{
                    color: `var(--${card.color}-9)`,
                    backgroundColor: `var(--${card.color}-3)`,
                  }}
                >
                  {React.cloneElement(card.icon)}
                </Box>
                <Flex direction="column" gap="1" align="start" p="3" style={{ flex: 1 }}>
                  <SectionHeader
                    className="card-header"
                    title={card.title}
                    description={card.description}
                    align="left"
                  />
                </Flex>
              </Flex>
            </Card>
          ))}
        </div>
      </Box>
    </AdminContentLayout>
  );
};
