import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useLocation } from 'react-router-dom';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { PadAction } from 'components/Pads/PadAction/PadAction';
import { styles } from './Navigation.styles';
import { ALTERNATIVE_PATHS } from 'routes/routes.config';

export const Navigation = () => {
  const location = useLocation();
  const isTimePage = location.pathname === ALTERNATIVE_PATHS.time;

  console.log('Navigation: isTimePage =', isTimePage);

  const { footerButtons } = useButtonConfig();

  if (footerButtons.length === 0) {
    return null;
  }

  return (
    <nav css={styles}>
      <div className="nav-wrapper">
        <NavigationMenu.Root className="nav-root">
          <NavigationMenu.List className="nav-list">
            {footerButtons.map((buttonProps) => (
              <NavigationMenu.Item key={buttonProps.id} className="nav-item">
                <NavigationMenu.Link asChild>
                  <PadAction {...buttonProps} />
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};
