import { Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useTranslation } from 'react-i18next';
import { styles } from './PageHeader.styles';

export const PageHeader = () => {
  const { t } = useTranslation();
  const { title } = useContent();
  const { route } = useRouteConfig();

  // Determine what title to show
  const getPageTitle = () => {
    // If ContentProvider has a title set, use it (for admin pages, etc.)
    if (title) {
      return title;
    }

    // If route has a translation key, use translated title
    if (route?.id) {
      const translationKey = `app.pages.${route.id}.title`;
      const translatedTitle = t(translationKey);

      // Only use translation if it's not the same as the key (meaning translation exists)
      if (translatedTitle !== translationKey) {
        return translatedTitle;
      }
    }

    // Fallback to route title
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

  // Don't render if no title
  if (!pageTitle) {
    return null;
  }

  return (
    <header className="page-header" css={styles}>
      <Container size="4">
        <Flex direction="column" align="center" gap="2">
          <Heading size="6" align="center" className="page-title">
            {pageTitle}
          </Heading>

          <Text size="3" align="center" className="page-subtitle" color="gray">
            {pageSubtitle && <>{pageSubtitle}</>}
          </Text>
        </Flex>
      </Container>
    </header>
  );
};
