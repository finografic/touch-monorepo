import { Suspense, useEffect, useState } from 'react';
import type { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { ContentProvider } from 'providers/ContentProvider';
import { DevProvider } from 'dev-tools/providers/DevProvider/DevProvider';
import { SessionProvider } from 'providers/SessionProvider/SessionProvider';
import { Loader } from 'components/Loader/Loader';
import { useIsMounted } from 'hooks/useIsMounted';
import { styles } from './AdminLayout.styles';
import { AdminProvider } from 'providers/AdminProvider/AdminProvider';
import { Footer } from 'components/Footer/Footer';
import { AdminNavigation } from 'components/AdminNavigation';
import { setConfiguration } from 'react-grid-system';
import { BREAKPOINT_VALUES } from 'styles/viewport/viewport.breakpoints';
import { AdminErrorBoundary } from 'components/ErrorBoundary/AdminErrorBoundary';
import { ToastProvider, ToastSystem } from 'components/Toast';

export const AdminLayout: FC = () => {
  const isMounted: boolean = !!useIsMounted();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  setConfiguration({ breakpoints: [...BREAKPOINT_VALUES] });

  // Handle navigation loading state
  useEffect(() => {
    setIsNavigating(true);

    // Small delay to prevent flashing and ensure smooth navigation
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
      {/* <ContentProvider> */}
      <DevProvider>
        <AdminProvider>
          <ToastProvider>
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
                        <AdminErrorBoundary>
                          <Suspense fallback={<Loader message="Loading..." />}>
                            {isNavigating ? <Loader message="Navigating..." /> : <Outlet />}
                          </Suspense>
                        </AdminErrorBoundary>
                      </div>
                      <nav className="page-navigation">{/* Page navigation can go here if needed */}</nav>
                    </section>
                  </div>
                </main>
                <Footer />
              </div>
              {/* Toast System for notifications */}
              <ToastSystem />
            </Theme>
          </ToastProvider>
        </AdminProvider>
      </DevProvider>
      {/* </ContentProvider> */}
    </SessionProvider>
  );
};
