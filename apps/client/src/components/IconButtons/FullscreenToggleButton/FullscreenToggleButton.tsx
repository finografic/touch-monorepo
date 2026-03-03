import { useCallback, useEffect, useState, type FC } from 'react';

import clsx from 'clsx';
import { Button } from 'components/Button/Button';

import { FullscreenIcon, MinimizeIcon } from '@workspace/design-system/icons';
import { styles } from './FullscreenToggleButton.styles';

export const FullscreenToggleButton: FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  // Sync state when fullscreen changes (e.g., user presses Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Fullscreen may fail if not triggered by user gesture or not supported
      console.warn('Fullscreen toggle failed:', error);
    }
  }, []);

  const label = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';

  return (
    <Button
      css={styles}
      className={clsx('button fullscreen-toggle', { 'is-fullscreen': isFullscreen })}
      onClick={toggleFullscreen}
      aria-label={label}
      title={label}
    >
      {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
    </Button>
  );
};
