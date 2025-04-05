import { Container } from 'react-grid-system';
import { styles } from './Header.css';

export function Header() {
  return (
    <header css={styles}>
      <Container>
        <nav className="nav">
          <div className="logo">Your App</div>
          <div className="user-name">{/* User menu content */}</div>
        </nav>
      </Container>
    </header>
  );
}
