import { Container } from 'react-grid-system';
import { useRouteConfig } from 'hooks/useRouteConfig';
import { styles } from './Header.styles';
import { usePageContent } from 'providers/PageContentProvider/PageContentContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const pageContent = usePageContent();
  const { title } = useRouteConfig();

  useEffect(() => {
    pageContent.setPageContentTitle('');
  }, [location.pathname]);

  return (
    <header css={styles}>
      <Container>
        <h1>{pageContent.title || title}</h1>
      </Container>
    </header>
  );
};
