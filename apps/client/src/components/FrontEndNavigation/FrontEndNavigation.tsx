import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { PadAction } from 'components/Pads/PadAction/PadAction';

import { useNavigationButtonsConfig } from 'hooks/buttons/useNavigationButtonsConfig';
import { useRouteChangeHandler } from 'hooks/useRouteChangeHandler';

import { styles } from './FrontEndNavigation.styles';

export const FrontEndNavigation = () => {
  const { footerButtons } = useNavigationButtonsConfig();

  // Handle route changes and filter synchronization
  useRouteChangeHandler();

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
