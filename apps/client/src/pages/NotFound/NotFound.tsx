import { Col, Row } from 'react-grid-system';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import type { RouteObject } from 'react-router-dom';
import { useRouteLoaderData } from 'react-router-dom';
import { NotFoundCard } from 'components/NotFoundCard';
import { styles } from './NotFound.styles';
import { useDev } from 'providers/DevProvider/DevContext';
import { useContent } from 'providers/ContentProvider/ContentContext';

const NotFound = (): ReactElement => {
  const { setContentTitle } = useContent();

  // NOTE: FOR DEVELOPMENT - OUTPUT FULL ROUTES OBJECT
  const { isDevToolsVisible } = useDev();
  const routesLoaderDataRoot = useRouteLoaderData('root') as RouteObject[];

  useEffect(() => {
    // TODO: MAKE "reset" UTIL INSIDE OF STORE
    setContentTitle('');
  }, []);

  return (
    <section css={styles}>
      <NotFoundCard />
      {isDevToolsVisible && (
        <Row style={{ width: '66%', textAlign: 'left' }}>
          <Col>
            <pre style={{ fontSize: '0.7em', lineHeight: 1.3 }}>
              {JSON.stringify(routesLoaderDataRoot, null, 2)}
            </pre>
          </Col>
        </Row>
      )}
    </section>
  );
};

export default NotFound;
