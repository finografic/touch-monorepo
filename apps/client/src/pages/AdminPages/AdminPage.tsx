import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { ChatBubbleIcon, GearIcon, GlobeIcon, SpeakerLoudIcon, TableIcon } from '@radix-ui/react-icons';
import { usePageTransition } from 'hooks/usePageTransition';
import { AdminContentLayout } from './shared';
import { styles } from './AdminPage.styles';
import { LanguageIcon } from 'styles/icons';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const { navigateWithTransition, isTransitioning } = usePageTransition({ delay: 150 });

  const adminCards = [
    {
      id: 'translations',
      title: t('admin.pages.translations.title'),
      description: t('admin.pages.translations.subtitle'),
      icon: <ChatBubbleIcon width="32" height="32" />,
      path: '/admin/translations',
      color: 'blue' as const,
    },
    {
      id: 'ui-labels',
      title: 'UI Labels / Translations',
      description: 'Edit user interface labels and translations from local files',
      icon: <ChatBubbleIcon width="32" height="32" />,
      path: '/admin/ui-labels',
      color: 'cyan' as const,
    },
    {
      id: 'languages',
      title: t('admin.pages.languages.title'),
      description: t('admin.pages.languages.subtitle'),
      icon: <LanguageIcon width="32" height="32" />,
      path: '/admin/languages',
      color: 'green' as const,
    },
    // {
    //   id: 'system',
    //   title: 'System Settings',
    //   description: 'Configure system-wide settings and preferences',
    //   icon: <GearIcon width="32" height="32" />,
    //   path: '/admin/system',
    //   color: 'orange' as const,
    // },
    {
      id: 'filter-analysis',
      title: 'Filter Analysis',
      description: 'Analyze orders data and filtering behavior',
      icon: <TableIcon width="32" height="32" />,
      // path: '/admin/filter-analysis',
      path: '/admin/orders',
      color: 'purple' as const,
    },
    {
      id: 'sounds',
      title: 'Sound Management',
      description: 'Upload and configure sound files for timer events',
      icon: <SpeakerLoudIcon width="32" height="32" />,
      path: '/admin/sounds',
      color: 'indigo' as const,
    },
    {
      id: 'slot-config',
      title: 'App Configuration',
      description: 'Configure modes, MainPage grid layout and slot types',
      icon: <GearIcon width="32" height="32" />,
      path: '/admin/slot-config',
      color: 'orange' as const,
      // color: 'amber' as const,
    },
    // {
    //   id: 'database',
    //   title: 'Database Management',
    //   description: 'Manage database connections and data integrity',
    //   icon: <TableIcon width="32" height="32" />,
    //   path: '/admin/database',
    //   color: 'purple' as const,
    // },
  ];

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
        <Box className="admin-dashboard">
          <Flex direction="column" gap="6" align="center">
            <SectionHeader
              title="Welcome to the Admin Panel"
              description="Select a section below to get started"
              align="center"
            />

            <div className="admin-cards">
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
                      className="card-icon"
                      style={{
                        color: `var(--${card.color}-9)`,
                        backgroundColor: `var(--${card.color}-3)`,
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
