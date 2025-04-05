import { Container } from 'react-grid-system';
import { useAuth } from 'lib/auth/AuthContext';
import { styles } from './DashboardPage.css';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div css={styles}>
      <Container>
        <h1 className="title">Dashboard</h1>
        <div className="welcome">
          Welcome back,
          {user?.name || user?.email}
        </div>
        <div className="content">
          {/* Dashboard content will go here */}
          <p>Your dashboard content...</p>
        </div>
      </Container>
    </div>
  );
}
