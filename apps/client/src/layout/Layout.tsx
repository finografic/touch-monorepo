import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header/Header';
import { DevDialog } from 'components/DevDialog/DevDialog';
import { PageContentProvider } from 'providers/PageContentProvider/PageContentProvider';
import { styles } from './Layout.styles';
import { DevTools } from 'components/DevTools/DevTools';
import { DndDemo } from './drag-and-drop/DndDemo';

export const Layout: FC = () => {
  return (
    <PageContentProvider>
      <div id="layout" css={styles}>
        <Header />
        <main>
          <div className="main-content">
            {/* <Outlet /> */}
            <DndDemo />
          </div>
        </main>
        <Footer />
      </div>
      <DevTools />
      <DevDialog />
    </PageContentProvider>
  );
};
