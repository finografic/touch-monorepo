import type { ReactElement } from 'react';
import { Row } from 'react-grid-system';

import { KEY_PRESS, useKeyPressToggle } from '@workspace/core';

import { DevScreenSize } from 'dev-tools/components/DevScreenSize/DevScreenSize';
import { useDevGuides } from '../../../providers/DevGuidesProvider';
import { styles } from './ScreenSizeOverlay.styles';

export const ScreenSizeOverlay = (): ReactElement | null => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();

  // NOTE: the `backtick` key to toggle dev guides visibility
  useKeyPressToggle({
    key: KEY_PRESS.BACKTICK,
    isActive: isDevGuidesVisibile,
    setIsActive: setIsDevGuidesVisibile,
  });

  return (
    <>
      {isDevGuidesVisibile && <DevScreenSize />}
      <Row css={styles}>
        {/* {isDevGuidesVisibile && <div className="screen-overlay screen-800x480" />} */}
        {isDevGuidesVisibile && <div className="screen-overlay screen-1024x600" />}
      </Row>
    </>
  );
};
