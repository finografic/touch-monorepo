import { Container } from 'react-grid-system';
import { styles } from './Header.styles';

export function Header() {
  return (
    <header css={styles}>
      <Container>
        <nav className="nav">
          <div className="logo">ServiFresc (header)</div>
          <div className="user-name">{/* User menu content */}</div>
        </nav>
      </Container>
    </header>
  );
}
