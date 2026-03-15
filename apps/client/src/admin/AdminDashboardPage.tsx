import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@finografic/design-system/components';
import { colors } from '@finografic/design-system/tokens';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { Box, Flex } from 'styled-system/jsx';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAuth } from 'providers/AuthProvider';

import { AdminPageLayout } from '.';
import { styles } from './AdminDashboardPage.styles';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });
  const { t } = useTranslation();

  const handleCardClick = (path: string) => {
    navigateWithTransition(path);
  };

  const role = user?.role === 'admin' ? 'admin' : 'public';

  const pageTitle = t('admin.pages.dashboard.title');
  const pageDescription = t('admin.pages.dashboard.description');

  const adminCards = useMemo(() => {
    return getAdminDashboardCards(role).map((card) => {
      const title = t(`admin.pages.${card.id}.title`);
      const description = t(`admin.pages.${card.id}.description`);

      return {
        id: card.id,
        title,
        description,
        icon: React.createElement(card.icon, { width: 32, height: 32 }),
        path: card.path,
        color: card.color,
      };
    });
  }, [role, t]);

  const gridColumns = adminCards.length === 1 ? 1 : 2;

  return (
    <AdminPageLayout title={pageTitle} subtitle={pageDescription} align="center">
      <div className="admin-dashboard" css={styles}>
        <div className="admin-cards" style={{ ['--cols' as any]: gridColumns }}>
          {adminCards.map((adminCard, i) => (
            <Card
              key={`${adminCard.id}-${i}`}
              size="lg"
              className="admin-card"
              onClick={() => handleCardClick(adminCard.path)}
              style={{
                cursor: isTransitioning ? 'wait' : 'pointer',
                opacity: isTransitioning ? 0.7 : 1,
                transition: 'opacity 0.2s ease',
              }}
            >
              <Flex direction="row" gap={1} justify="start" align="stretch" height="100%" py={2}>
                <Flex>
                  <Box
                    className="card-icon-box"
                    style={{
                      color: colors[adminCard.color as keyof typeof colors] as string,
                      backgroundColor: colors[`${adminCard.color}XLight` as keyof typeof colors] as string,
                    }}
                  >
                    {React.cloneElement(adminCard.icon)}
                  </Box>
                </Flex>
                <Flex direction="column" gap={1} align="stretch" justify="start" pt={2}>
                  <SectionHeader
                    className="card-header"
                    title={adminCard.title}
                    description={adminCard.description}
                    align="left"
                  />
                </Flex>
              </Flex>
            </Card>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  );
};
