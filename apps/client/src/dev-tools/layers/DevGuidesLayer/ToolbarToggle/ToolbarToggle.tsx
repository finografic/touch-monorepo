import clsx from 'clsx';

import { useDevGuides } from '../../../providers/DevGuidesProvider';
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from 'styles/icons';
import { styles } from './ToolbarToggle.styles';

export const ToolbarToggle = () => {
  const { isDevGuidesVisibile, setIsDevGuidesVisibile } = useDevGuides();

  const handleClick = () => {
    setIsDevGuidesVisibile(!isDevGuidesVisibile);
  };

  return (
    <div css={styles} className={clsx('icon-toggle', { open: isDevGuidesVisibile })} onClick={handleClick}>
      {isDevGuidesVisibile ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
    </div>
  );
};
