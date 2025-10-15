import React from 'react';
import { Box, Card, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from 'hooks/usePageTransition';
import { AdminContentLayout } from '.';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { getCalloutText } from './utils/i18n.utils';
import type { AuthRoles } from 'admin/config/admin.routes.map';
import { styles } from './AdminDashboardPage.styles';

export const AdminDashboardBasicPage: React.FC = () => {
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });

  const { t } = useTranslation();
  const role: AuthRoles = 'public';
  // Public dashboard shows public-only items
  const adminCards = getAdminDashboardCards(false).map((card) => {
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

  // Calculate grid columns based on card count
  const gridColumns = adminCards.length <= 2 ? 1 : adminCards.length <= 4 ? 2 : 3;

  console.log('🎴 Admin Dashboard (Basic):', {
    cardCount: adminCards.length,
    gridColumns,
    cards: adminCards.map((c) => c.id),
  });

  return (
    <AdminContentLayout
      title="Admin Dashboard"
      subtitle="Manage system settings, translations, and configurations"
      centerTitle={true}
      css={styles}
    >
      <Box className="admin-dashboard">
        <SectionHeader title="Admin Configuration" align="center" />
        <div
          className="admin-cards"
          style={{
            ['--cols' as any]: gridColumns,
          }}
        >
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
                <Flex direction="row" gap="3" align="center" p="3">
                  <Box
                    className="card-icon-box"
                    style={{
                      color: `var(--${card.color}-9)`,
                      backgroundColor: `var(--${card.color}-3)`,
                      minWidth: '48px',
                      minHeight: '48px',
                    }}
                  >
                    {React.cloneElement(card.icon, { width: 24, height: 24 })}
                  </Box>
                  <Flex direction="column" gap="1" align="start" style={{ flex: 1 }}>
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
