import { Container } from 'react-grid-system';
import { useRouteConfig } from '../../hooks/useRouteConfig';
import { styles } from './Header.styles';

export const Header = () => {
  const { title } = useRouteConfig();

  return (
    <header css={styles}>
      <Container>
        <h1>{title}</h1>
      </Container>
    </header>
  );
};
