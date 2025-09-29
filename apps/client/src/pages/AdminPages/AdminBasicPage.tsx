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

  const userCards = [];

  const adminCards = [
    {
      id: 'languages',
      title: t('admin.pages.languages.title'),
      description: t('admin.pages.languages.subtitle'),
      icon: <LanguageIcon width="32" height="32" />,
      path: '/admin/languages',
      color: 'green' as const,
    },
    {
      id: 'sounds',
      title: 'Sound Management',
      description: 'Upload and configure sound files for timer events',
      icon: <SpeakerLoudIcon width="32" height="32" />,
      path: '/admin/sounds',
      color: 'indigo' as const,
    },
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
          {/* <Flex direction="column" gap="6" align="center">
            <SectionHeader
              title="User Configuration"
              align="center"
            />
            <div className="admin-cards">
              {userCards.map((card) => (<></> ))}
            </div>
          </Flex> */}

          <Flex direction="column" gap="6" align="center">
            <SectionHeader title="Admin Configuration" align="center" />

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
