import { useState } from 'react';

import { Col, Row } from 'react-grid-system';

import type { ReactElement } from 'react';

import { styles } from './DevColumns.styles';

export const DevColumns = (): ReactElement | null => {
  const [numCols, setNumCols] = useState(4);
  const colSize = Math.floor(12 / numCols);

  return (
    <Row css={styles}>
      {Array.from({ length: numCols }, (_, index) => (
        <Col key={`toolbar-col-${index}`} xs={colSize} className="toolbar-col" />
      ))}
    </Row>
  );
};
