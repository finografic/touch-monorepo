import { Container } from 'react-grid-system';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { styles } from './Header.styles';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const pageContent = useContent();
  const routeConfig = useRouteConfig();

  useEffect(() => {
    pageContent.setContentTitle('');
  }, [location.pathname]);

  return (
    <header css={styles}>
      <Container>
        <h1>{pageContent.title || routeConfig?.title}</h1>
      </Container>
    </header>
  );
};
