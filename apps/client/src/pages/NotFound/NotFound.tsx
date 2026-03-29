import type { ReactElement } from 'react';
import { NotFoundCard } from 'components/NotFoundCard';

import { styles } from './NotFound.styles';

const NotFound = (): ReactElement => {
  return (
    <section css={styles}>
      <NotFoundCard />
    </section>
  );
};

export default NotFound;
