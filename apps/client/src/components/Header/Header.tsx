import { Container, Flex } from '@radix-ui/themes';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { styles } from './Header.styles';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { currentLanguage, title } = useContent();
  const { route } = useRouteConfig();

  useEffect(() => {
    // pageContent.setContentTitle('');
    console.log('__DEV: currentLanguage', currentLanguage);
  }, [location.pathname, title, currentLanguage]);

  return (
    <header css={styles}>
      <Container size="4">
        <Flex justify="between" align="center" width="100%" style={{ display: 'flex' }}>
          {/* ====================================================================== */}
          <Flex justify="start" style={{ flex: '3' }}>
            {/* Space for future content */}
          </Flex>

          {/* Center column - 6 parts */}
          <Flex justify="center" style={{ flex: '6' }}>
            {/* <h1>{pageContent?.title || route?.title}</h1> */}
            <h1>{t('titles.app')}</h1>
          </Flex>

          <Flex justify="end" style={{ flex: '3' }}>
            {/* <LanguageSelector onLanguageChange={handleLanguageChange} /> */}
            <pre className="current-language">{String(currentLanguage)}</pre>
          </Flex>
          {/* ====================================================================== */}
        </Flex>
      </Container>
    </header>
  );
};
