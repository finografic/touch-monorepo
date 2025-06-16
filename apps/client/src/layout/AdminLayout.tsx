import { Suspense } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ContentProvider } from 'providers/ContentProvider';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { Loader } from 'components/Loader/Loader';
import { useIsMounted } from 'hooks/useIsMounted';
import { styles } from './AdminLayout.styles';

export const AdminLayout: FC = () => {
  const isMounted: boolean = !!useIsMounted();

  if (!isMounted) {
    return <Loader message="Loading Admin..." />;
  }

  return (
    <SessionProvider>
      <ContentProvider>
        <AdminProvider>
          <DevProvider>
            <div id="admin-layout" css={styles}>
              <header className="admin-header">
                <div className="header-content">
                  <h1>Administration Panel</h1>
                  <div className="header-actions">{/* Admin-specific header actions can go here */}</div>
                </div>
              </header>

              <main className="admin-main">
                <Suspense fallback={<Loader message="Loading..." />}>
                  <Outlet />
                </Suspense>
              </main>

              <footer className="admin-footer">
                <div className="footer-content">{/* Admin tools will be rendered by AdminProvider */}</div>
              </footer>
            </div>
          </DevProvider>
        </AdminProvider>
      </ContentProvider>
    </SessionProvider>
  );
};
