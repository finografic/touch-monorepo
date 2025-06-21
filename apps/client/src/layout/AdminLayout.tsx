import { Suspense } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ContentProvider } from 'providers/ContentProvider';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { Loader } from 'components/Loader/Loader';
import { useIsMounted } from 'hooks/useIsMounted';
import { styles } from './AdminLayout.styles';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { Footer } from 'components/Footer/Footer';

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
              <header>
                <div className="header-content">
                  <h1>Administration Panel</h1>
                  <div className="header-actions">{/* Admin-specific header actions can go here */}</div>
                </div>
              </header>

              <main>
                <div className="main-content">
                  <section>
                    <header className="page-header">{/* Page header content will go here */}</header>
                    <div className="page-content" role="main">
                      <Suspense fallback={<Loader message="Loading..." />}>
                        <Outlet />
                      </Suspense>
                    </div>
                    <nav className="page-navigation">{/* Page navigation can go here if needed */}</nav>
                  </section>
                </div>
              </main>

              <Footer />
            </div>
          </DevProvider>
        </AdminProvider>
      </ContentProvider>
    </SessionProvider>
  );
};
