import clsx from 'clsx';
import { styles } from './ToolbarToggle.styles';
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from 'styles/icons';
import { useDevGuides } from '../../../providers/DevGuidesProvider';

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
