import { Container } from 'react-grid-system';
import { useLocation } from 'react-router-dom';
import { PAGE_TITLES } from 'constants/pages.constants';
import { ROUTES } from 'constants/routes.constants';
import { styles } from './Header.styles';
import { PagePathname } from 'types/pages.types';

export const Header = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname as PagePathname] || PAGE_TITLES[ROUTES.HOME];

  return (
    <header css={styles}>
      <Container>
        <h1>{title}</h1>
      </Container>
    </header>
  );
};
