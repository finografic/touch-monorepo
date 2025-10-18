import { Box, Flex } from '@radix-ui/themes';
import { useDev } from 'dev-tools/providers/DevProvider/DevContext';
import { LockIcon, TextAlignTopIcon } from 'styles/icons';
import { QueryDevtoolsPanel } from '../layers/QueryDevtoolsPanel/QueryDevtoolsPanel';
import { DevScreenSize } from '../components/DevScreenSize/DevScreenSize';
import { useKeyPressFrontEnd } from 'hooks/useKeyPressFrontEnd';
import { MockOrdersButton } from '../mocks/MockOrdersButton/MockOrdersButton';
import { MockTimersMin } from '../mocks/MockTimersMin/MockTimersMin';
import { MockSessionTimer } from '../mocks/MockSessionTimer/MockSessionTimer';
import { useTimers } from 'providers/TimersProvider';
// import { DevPanelRight } from '../DevPanels/DevPanelRight';
import { DevPanelLeft } from 'dev-tools/_Panels/DevPanelLeft';
import { styles } from './DevToolbarFrontEnd.styles';
import { useAppConfig } from 'providers/AppConfigProvider';

export const DevToolbarFrontEnd = () => {
  const { theme } = useAppConfig();
  const { timers } = useTimers();
  const {
    isDevToolsVisible,
    isDevAuthVisible,
    isDevSimpleLoginVisible,
    isDevQueryPanelOpen,
    setIsDevAuthVisible,
    setIsDevSimpleLoginVisible,
    setIsDevQueryPanelOpen,
  } = useDev();

  useKeyPressFrontEnd();

  if (!isDevToolsVisible) return null;

  return (
    <>
      <>
        {/* <DevScreenSize /> */}
        {isDevToolsVisible && <DevPanelLeft />}
        {/* {isDevToolsVisible && <DevPanelRight />} */}
      </>
      <div css={styles} className={`theme-${theme}`}>
        <Flex gap="3" align="center">
          {timers.some((timer) => timer.status === 'processing') && (
            <div className="button-box">
              <MockTimersMin />
            </div>
          )}

          <div className="button-box">
            <MockOrdersButton />
          </div>

          <div className="button-box">
            <button
              className="button button-toggle-query-panel"
              onClick={() => setIsDevQueryPanelOpen(!isDevQueryPanelOpen)}
            >
              <TextAlignTopIcon />
            </button>
          </div>

          <div className="button-box">
            <button
              className="button button-toggle-auth"
              onClick={() => setIsDevAuthVisible(!isDevAuthVisible)}
            >
              <LockIcon />
            </button>
          </div>

          <div className="button-box">
            <button
              className="button button-toggle-simple-login"
              onClick={() => setIsDevSimpleLoginVisible(!isDevSimpleLoginVisible)}
            >
              <LockIcon />
            </button>
          </div>
        </Flex>
      </div>

      {isDevQueryPanelOpen && <QueryDevtoolsPanel onClose={() => setIsDevQueryPanelOpen(false)} />}
    </>
  );
};
