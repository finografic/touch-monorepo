import { Col, Row } from 'react-grid-system';
import type { ReactElement } from 'react';
import { styles } from './ScreenSizeOverlay.styles';
import { useKeyPressGuides } from '../useKeyPressGuides';
import { useDevGuides } from '../DevGuidesContext';

export const ScreenSizeOverlay = (): ReactElement | null => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();
  useKeyPressGuides({ isActive: isDevGuidesVisibile, setIsActive: setIsDevGuidesVisibile, keyCode: '' });

  return (
    <Row css={styles}>
      <div className="screen-800x480" />
      {/* {Array.from({ length: numCols }, (_, index) => (
        <Col key={`toolbar-col-${index}`} xs={colSize} className="toolbar-col" />
      ))} */}
    </Row>
  );
};
