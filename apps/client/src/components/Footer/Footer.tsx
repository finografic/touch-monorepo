import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex } from '@radix-ui/themes';

import { AdminToolbar } from 'components/Toolbars/AdminToolbar/AdminToolbar';
import { FrontEndToolbar } from 'components/Toolbars/FrontEndToolbar/FrontEndToolbar';

import { DevToolbarFrontEnd } from 'dev-tools/_DevToolbarFrontEnd/DevToolbarFrontEnd';

import { styles } from './Footer.styles';

export const Footer: FC = () => {
  const location = useLocation();

  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }} className="col col-left">
          {location.pathname.startsWith('/admin') ? <AdminToolbar /> : <FrontEndToolbar />}
        </Flex>
        <Flex justify="end" style={{ flex: '1' }} className="col col-right">
          {location.pathname.startsWith('/admin') ? <></> : <DevToolbarFrontEnd />}
        </Flex>
      </Flex>
    </footer>
  );
};
