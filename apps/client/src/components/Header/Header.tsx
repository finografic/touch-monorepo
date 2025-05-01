import { Container } from 'react-grid-system';
import { useRouteConfig } from 'hooks/useRouteConfig';
import { styles } from './Header.styles';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();
  const pageContent = useContent();
  const { title } = useRouteConfig();

  useEffect(() => {
    pageContent.setContentTitle('');
  }, [location.pathname]);

  return (
    <header css={styles}>
      <Container>
        <h1>{pageContent.title || title}</h1>
      </Container>
    </header>
  );
};
