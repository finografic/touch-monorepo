import React from 'react';
import { Box, Card, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from 'hooks/usePageTransition';
import { AdminContentLayout } from '.';
import { styles } from './AdminDashboardPage.styles';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { getCalloutText } from './utils/i18n.utils';
import type { AuthRoles } from 'admin/config/admin.routes.map';
import { AdminAccessTest } from 'admin/components/AdminAccessTest/AdminAccessTest';

export const AdminDashboardPage: React.FC = () => {
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });

  const { t } = useTranslation();
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

  return (
    <AdminContentLayout
      title="Admin Dashboard"
      subtitle="Manage system settings, translations, and configurations"
      centerTitle={true}
      css={styles}
    >
      <Box className="admin-dashboard">
        <Flex direction="column" gap="4" align="center">
          <SectionHeader title="Admin Configuration" align="center" />
          <AdminAccessTest />
          <div
            className="admin-cards"
            style={{
              ['--cols' as any]: Math.min(3, Math.max(1, Math.ceil(adminCards.length / 2))),
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
        </Flex>
      </Box>
    </AdminContentLayout>
  );
};
