import React from 'react';
import { useTranslation } from 'react-i18next';
import { getMessages } from '@workspace/i18n';

import { Box, Card, Flex } from '@radix-ui/themes';
import type { AuthRoles } from 'admin/config/admin.routes.map';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { NoAdminEntryRedirect } from 'admin/NoAdminEntryRedirect';
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

  // NEW: Get type-safe messages for current language
  const messages = getMessages(currentLanguage);

  log('🌐 Current Language:', 'lime', currentLanguage);
  log('🎯 NEW Messages System:', 'cyan', {
    title: messages.admin.pages.dashboard.title,
    description: messages.admin.pages.dashboard.description,
  });

  const role: AuthRoles = 'admin';
  // Admin dashboard shows the authenticated view; selector filtering with true includes admin/auth items

  const adminCards = getAdminDashboardCards(true).map((card) => {
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

  if (!isAuthenticated) {
    return <NoAdminEntryRedirect />;
  }

  return (
    <AdminContentLayout
      title={messages.admin.pages.dashboard.title}
      subtitle={messages.admin.pages.dashboard.description}
      align="center"
    >
      <Box className="admin-dashboard" css={styles}>
        {/* <SectionHeader title="Admin Configuration" align="center" /> */}
        {/* <AdminAccessTest /> */}
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
