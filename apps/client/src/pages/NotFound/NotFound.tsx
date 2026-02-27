import type { ReactElement } from 'react';
import { useEffect } from 'react';
import type { RouteObject } from 'react-router-dom';
import { useRouteLoaderData } from 'react-router-dom';

import { NotFoundCard } from 'components/NotFoundCard';

import { useContent } from 'providers/ContentProvider/ContentContext';

import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
import { styles } from './NotFound.styles';

const NotFound = (): ReactElement => {
  // const { setContentTitle } = useContent();

  // NOTE: FOR DEVELOPMENT - OUTPUT FULL ROUTES OBJECT
  // const { isDevToolsVisible } = useDev();
  // const routesLoaderDataRoot = useRouteLoaderData('routes') as RouteObject[];

  useEffect(() => {
    // TODO: MAKE "reset" UTIL INSIDE OF STORE
    // setContentTitle('');
  }, []);

  return (
    <section css={styles}>
      <NotFoundCard />
      {/* {isDevToolsVisible && (
        <Row style={{ width: '66%', textAlign: 'left' }}>
          <Col>
            <pre style={{ fontSize: '0.7em', lineHeight: 1.3 }}>
              {JSON.stringify(routesLoaderDataRoot, null, 2)}
            </pre>
          </Col>
        </Row>
      )} */}
    </section>
  );
};

export default NotFound;
