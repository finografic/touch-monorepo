import type { ReactNode } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'styled-system/jsx';
import { Container } from '@finografic/design-system/grid';
import { LucideArrowRightSquare } from 'lucide-react';

import { useMetadata } from 'providers/MetadataProvider/MetadataContext';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';

import { ROUTE_FILTER_KEYS } from 'config/app';
import { styles } from './PageHeader.styles';

// TODO: OVERRIDES..
const isPageTitleVisible = true;
const isPageSubtitleVisible = false;

export const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  const { title } = useMetadata();
  const { route } = useRouteConfig();

  const getPageTitle = () => {
    // If Metadata has a title set, use it (for admin pages, etc.)
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
        <Container>
          <Flex direction="column" align="center" gap={8}>
            {isPageTitleVisible && pageTitle && (
              <h2 className="page-title">
                {' '}
                {/* {pageTitle} */}
              </h2>
            )}
            {(route?.id === ROUTE_FILTER_KEYS.drinkSubtype
              ? pageSubtitle
              : isPageSubtitleVisible && pageSubtitle) && (
              <span className="page-subtitle">
                {pageSubtitle}
              </span>
            )}
          </Flex>
        </Container>
      </header>
    </div>
  );
};
