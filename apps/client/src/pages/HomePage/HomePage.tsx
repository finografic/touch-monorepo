import { Container } from 'react-grid-system';
import { styles } from './HomePage.css';

export function HomePage() {
  return (
    <div css={styles}>
      <Container>
        <h1>Welcome</h1>
        <p className="subtitle">This is the home page</p>
      </Container>
    </div>
  );
}
