import { Col, Row } from 'react-grid-system';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { styles } from './DevScreenSizes.styles';

export const DevScreenSizes = (): ReactElement | null => {
  const [numCols, setNumCols] = useState(4);
  const colSize = Math.floor(12 / numCols);

  return (
    <Row css={styles}>
      <div className="screen-800x480" />
      {/* {Array.from({ length: numCols }, (_, index) => (
        <Col key={`toolbar-col-${index}`} xs={colSize} className="toolbar-col" />
      ))} */}
    </Row>
  );
};
