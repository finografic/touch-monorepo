import type { ReactElement } from 'react';
import React from 'react';
import { Col, Row } from 'react-grid-system';
import { ToolbarToggle } from '../ToolbarToggle';
import { useDevLayer } from '../DevLayerContext';
import { styles } from './DevToolbar.styles';

export const DevToolbar: React.FC = (): ReactElement => {
  const { isToolbarOpen } = useDevLayer();

  return (
    <div css={styles}>
      <ToolbarToggle />
      <Row id="___TOOLBAR___" className={`toolbar ${isToolbarOpen ? 'open' : ''}`}>
        <Col></Col>
      </Row>
    </div>
  );
};
