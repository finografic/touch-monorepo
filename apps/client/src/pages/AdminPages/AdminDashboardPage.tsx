import React from 'react';
import { Box, Card, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { usePageTransition } from 'hooks/usePageTransition';
import { AdminContentLayout } from './shared';
import { styles } from './AdminPage.styles';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';
import { getAdminDashboardCards } from 'config/routes/admin.routes.selectors';
import { useAuth } from 'providers/AuthProvider/AuthContext';
import { getCalloutText } from './i18n.utils';
import type { AuthRoles } from 'config/routes/admin.routes.map';

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
    <section css={styles} id="admin-dashboard">
      <AdminContentLayout
        title="Admin Dashboard"
        subtitle="Manage system settings, translations, and configurations"
        centerTitle={true}
      >
        <Box
          className="admin-dashboard"
          style={{ ['--cols' as any]: Math.min(3, Math.max(1, adminCards.length)) }}
        >
          <Flex direction="column" gap="6" align="center">
            <SectionHeader title="Admin Configuration" align="center" />
            <div
              className="admin-cards"
              style={{ ['--cols' as any]: Math.min(3, Math.max(1, adminCards.length)) }}
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
                  <Flex direction="column" gap="4" align="center" p="4">
                    <Box
                      className="card-icon-box"
                      style={{
                        color: `var(--${card.color}-9)`,
                        backgroundColor: `var(--${card.color}-3)`,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <SectionHeader
                      className="card-header"
                      title={card.title}
                      description={card.description}
                      align="center"
                    />
                  </Flex>
                </Card>
              ))}
            </div>
          </Flex>
        </Box>
      </AdminContentLayout>
    </section>
  );
};
