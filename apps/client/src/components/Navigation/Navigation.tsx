import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { ActionButton } from 'components/ActionButton/ActionButton';
import { styles } from './Navigation.styles';

export const Navigation = () => {
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
                  <ActionButton {...buttonProps} />
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};
