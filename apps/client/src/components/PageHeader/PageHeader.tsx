import React from 'react';
import type { ReactNode } from 'react';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useTranslation } from 'react-i18next';
import { styles } from './PageHeader.styles';
import { ROUTE_FILTER_KEYS } from 'config/app';
import { LucideArrowRightSquare } from 'lucide-react';

// TODO: OVERRIDES..
const isPageTitleVisible = true;
const isPageSubtitleVisible = false;

export const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  const { title } = useContent();
  const { route } = useRouteConfig();

  const getPageTitle = () => {
    // If ContentProvider has a title set, use it (for admin pages, etc.)
    if (title) {
      return title;
    }

    // If route has a translation key, use translated title
    if (route?.id) {
      const translationKey = `app.pages.${route.id}.title`;
      const translatedTitle = t(translationKey);

      // log('__DEV: route', 'cyan', route);
      // log('__DEV: title_1 - id, translationKey', 'grey', route.id, translationKey);
      // log('__DEV: title_2 - translatedTitle', 'grey', translatedTitle);

      // Only use translation if it's not the same as the key (meaning translation exists)
      if (translatedTitle !== translationKey) {
        return translatedTitle;
      }
    }

    return route?.title || '';
  };

  // Get subtitle if available
  const getPageSubtitle = () => {
    if (route?.id) {
      const translationKey = `app.pages.${route.id}.subtitle`;
      const translatedSubtitle = t(translationKey);

      // Only use translation if it's not the same as the key (meaning translation exists)
      if (translatedSubtitle !== translationKey) {
        return translatedSubtitle;
      }
    }

    return '';
  };

  const pageTitle = getPageTitle();
  const pageSubtitle = getPageSubtitle();

  // log('__DEV: pageTitle', 'grey', pageTitle);
  // log('__DEV: pageSubtitle', 'grey', pageSubtitle);
  // log('__DEV: isPageTitleVisible', 'grey', isPageTitleVisible);
  // log('__DEV: isPageSubtitleVisible', 'grey', isPageSubtitleVisible);

  if (!isPageTitleVisible || !pageTitle) {
    return null;
  }

  return (
    <div css={styles}>
      <header className="page-header">
        <Container size="4">
          <Flex direction="column" align="center" gap="8">
            {isPageTitleVisible && pageTitle && (
              <Heading size="4" align="center" className="page-title">
                A {pageTitle}
              </Heading>
            )}
            {(route?.id === ROUTE_FILTER_KEYS.drinkSubtype
              ? pageSubtitle
              : isPageSubtitleVisible && pageSubtitle) && (
              <Text size="3" align="center" className="page-subtitle" color="gray">
                B {pageSubtitle}
              </Text>
            )}
          </Flex>
        </Container>
      </header>
    </div>
  );
};
