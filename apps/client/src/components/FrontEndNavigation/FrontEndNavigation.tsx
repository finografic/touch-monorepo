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
        <div className="nav-root">
          <ul className="nav-list">
            {footerButtons.map((buttonProps) => (
              <li key={buttonProps.id} className="nav-item">
                <PadAction {...buttonProps} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
