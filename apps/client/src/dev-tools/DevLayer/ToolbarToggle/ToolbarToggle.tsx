import clsx from 'clsx';
import { styles } from './ToolbarToggle.styles';
import { useDevLayer } from '../DevLayerContext';
import { PanelBottomCloseIcon, PanelBottomOpenIcon } from 'styles/icons';

export const ToolbarToggle = () => {
  const { isToolbarOpen, setIsToolbarOpen } = useDevLayer();

  const handleClick = () => {
    // setLayoutState({ isSidebarOpen: !isSidebarOpen });
    // setLayoutState({ isScrollLocked: !isScrollLocked });
    setIsToolbarOpen(!isToolbarOpen);
  };

  return (
    <div css={styles} className={clsx('icon-toggle', { open: isToolbarOpen })} onClick={handleClick}>
      {isToolbarOpen ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
    </div>
  );
};
