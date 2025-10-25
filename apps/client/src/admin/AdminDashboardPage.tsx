import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Flex } from '@radix-ui/themes';
import { getAdminDashboardCards } from 'admin/config/admin.routes.selectors';
import { m } from 'paraglide/messages.js';
import { setLocale } from 'paraglide/runtime.js';
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
  useEffect(() => {
    setLocale(currentLanguage as 'en-GB' | 'es-ES');
  }, [currentLanguage]);

  const role = user?.role === 'admin' ? 'admin' : 'public';

  const adminCards = useMemo(() => {
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

  const gridColumns = adminCards.length === 1 ? 1 : 2;

  return (
    <AdminContentLayout
      title={m.admin_dashboard_title({ role })}
      subtitle={m.admin_dashboard_description({ role })}
      align="center"
    >
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
