import { Container } from 'react-grid-system';
import { styles } from './Header.styles';

export const Header = () => {
  //
  return (
    <header css={styles}>
      <Container>
        <h1>ServiFresc</h1>
      </Container>
    </header>
  );
};
