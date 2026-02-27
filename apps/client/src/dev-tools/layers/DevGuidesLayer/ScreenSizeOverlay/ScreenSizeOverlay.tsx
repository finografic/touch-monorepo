import type { ReactElement } from 'react';
import { KEY_PRESS, useKeyPressToggle } from '@workspace/core/hooks';

import { DevScreenSize } from 'dev-tools/components/DevScreenSize/DevScreenSize';
import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
import { useDevGuides } from '../../../providers/DevGuidesProvider';
import { styles } from './ScreenSizeOverlay.styles';

export const ScreenSizeOverlay = (): ReactElement | null => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();
  const { isDevToolsVisible, setIsDevToolsVisible } = useDev();

  // NOTE: the `backtick` key to toggle dev guides visibility
  useKeyPressToggle({
    key: KEY_PRESS.BACKTICK,
    isActive: isDevGuidesVisibile,
    setIsActive: setIsDevGuidesVisibile,
  });

  useKeyPressToggle({
    key: KEY_PRESS.CONTROL,
    isActive: isDevToolsVisible,
    setIsActive: setIsDevToolsVisible,
  });

  return (
    <>
      {isDevToolsVisible && <DevScreenSize />}
      <div css={styles}>
        {/* {isDevGuidesVisibile && <div className="screen-overlay screen-800x480" />} */}
        {isDevGuidesVisibile && <div className="screen-overlay screen-1024x600" />}
      </div>
    </>
  );
};
