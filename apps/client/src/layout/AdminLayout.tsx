import { Suspense } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { ContentProvider } from 'providers/ContentProvider';
import { DevProvider } from 'providers/DevProvider/DevProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { Loader } from 'components/Loader/Loader';
import { useIsMounted } from 'hooks/useIsMounted';
import { styles } from './AdminLayout.styles';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { Footer } from 'components/Footer/Footer';
import { AdminNavigation } from 'components/AdminNavigation';
import { setConfiguration } from 'react-grid-system';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';

export const AdminLayout: FC = () => {
  const isMounted: boolean = !!useIsMounted();
  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  if (!isMounted) {
    return <Loader message="Loading Admin..." />;
  }

  // Admin theme configuration
  const adminTheme = {
    appearance: 'light' as const, // Light theme for admin
    grayColor: 'slate' as const, // Professional gray
    accentColor: 'blue' as const, // Blue accent for admin actions
    scaling: '100%' as const, // Standard scaling
  };

  return (
    <SessionProvider>
      <ContentProvider>
        <AdminProvider>
          <DevProvider>
            <Theme
              appearance={adminTheme.appearance}
              grayColor={adminTheme.grayColor}
              accentColor={adminTheme.accentColor}
              scaling={adminTheme.scaling}
            >
              <div id="admin-layout" css={styles}>
                <header>
                  <div className="header-content">
                    <h1>Administration Panel</h1>
                    <div className="header-actions">
                      <AdminNavigation />
                    </div>
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
            </Theme>
          </DevProvider>
        </AdminProvider>
      </ContentProvider>
    </SessionProvider>
  );
};
