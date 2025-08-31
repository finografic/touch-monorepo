import { Row } from 'react-grid-system';
import type { ReactElement } from 'react';
import { styles } from './ScreenSizeOverlay.styles';
import { KEY_PRESS, useKeyPressToggle } from '@workspace/core';
import { useDevGuides } from '../DevGuidesContext';

export const ScreenSizeOverlay = (): ReactElement | null => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();

  // NOTE: the `backtick` key to toggle dev guides visibility
  useKeyPressToggle({
    key: KEY_PRESS.BACKTICK,
    isActive: isDevGuidesVisibile,
    setIsActive: setIsDevGuidesVisibile,
  });

  return (
    <Row css={styles}>
      {/* {isDevGuidesVisibile && <div className="screen-overlay screen-800x480" />} */}
      {isDevGuidesVisibile && <div className="screen-overlay screen-1024x600" />}
    </Row>
  );
};
