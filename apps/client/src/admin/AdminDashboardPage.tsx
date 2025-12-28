import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Flex } from '@radix-ui/themes';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { setLocale } from 'i18n/runtime';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

import { usePageTransition } from 'hooks/usePageTransition';
import { useAppConfig } from 'providers/AppConfigProvider';
import { useAuth } from 'providers/AuthProvider';

import { AdminPageLayout } from '.';
import { styles } from './AdminDashboardPage.styles';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentLanguage } = useAppConfig();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });
  const { t } = useTranslation();

  const handleCardClick = (path: string) => {
    navigateWithTransition(path);
  };

  // Set ParaglideJS locale to match app's current language
  useEffect(() => {
    setLocale(currentLanguage as 'en-GB' | 'es-ES');
  }, [currentLanguage]);

  const role = user?.role === 'admin' ? 'admin' : 'public';

  const pageTitle = t('admin.pages.dashboard.title');
  const pageDescription = t('admin.pages.dashboard.description');

  const adminCards = useMemo(() => {
    return getAdminDashboardCards(isAuthenticated, role).map((card) => {
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
  }, [isAuthenticated, role]);

  const gridColumns = adminCards.length === 1 ? 1 : 2;

  return (
    <AdminPageLayout title={pageTitle} subtitle={pageDescription} align="center">
      <Box className="admin-dashboard" css={styles}>
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
              <Flex direction="row" gap="1" justify="start" align="stretch" height="100%" py="2">
                <Flex>
                  <Box
                    className="card-icon-box"
                    style={{ color: `var(--${card.color}-9)`, backgroundColor: `var(--${card.color}-3)` }}
                  >
                    {React.cloneElement(card.icon)}
                  </Box>
                </Flex>
                <Flex direction="column" gap="1" align="stretch" justify="start" pt="2">
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
    </AdminPageLayout>
  );
};
