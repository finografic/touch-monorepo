// import { Container } from 'react-grid-system';
import { Outlet } from 'react-router-dom';

import { useAuth } from 'lib/auth/AuthContext';
import { styles } from './Layout.css';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div css={styles}>
      {/* <header>
        <Container>
          <nav>
            <div className="app-logo">ServiFresc</div>
            {user && (
              <div className="user-menu">
                <span>{user.email}</span>
                <button className="btn-logout" onClick={() => logout()}>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </Container>
      </header> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
