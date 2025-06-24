import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleIcon, GearIcon, GlobeIcon, TableIcon } from '@radix-ui/react-icons';
import { AdminContentLayout } from './shared';
import { styles } from './AdminPage.styles';
import { LanguageIcon } from 'styles/icons';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    {
      id: 'system',
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: <GearIcon width="32" height="32" />,
      path: '/admin/system',
      color: 'orange' as const,
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
    navigate(path);
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
            <Box mb="4" style={{ textAlign: 'center' }}>
              <Heading size="6" align="center" mb="2">
                Welcome to the Admin Panel
              </Heading>
              <Text size="3" color="gray" align="center">
                Select a section below to get started
              </Text>
            </Box>

            <Flex gap="6" wrap="wrap" justify="center" className="admin-cards">
              {adminCards.map((card) => (
                <Card
                  key={card.id}
                  className="admin-card"
                  size="3"
                  variant="surface"
                  onClick={() => handleCardClick(card.path)}
                  style={{ cursor: 'pointer', minWidth: '280px', maxWidth: '320px' }}
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

                    <Box style={{ textAlign: 'center' }}>
                      <Heading size="4" mb="2" color={card.color}>
                        {card.title}
                      </Heading>
                      <Text size="2" color="gray" style={{ lineHeight: '1.5' }}>
                        {card.description}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Flex>
        </Box>
      </AdminContentLayout>
    </section>
  );
};
