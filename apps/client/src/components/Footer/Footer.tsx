import type { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import { styles } from './Footer.styles';
import { useLocation } from 'react-router-dom';
import { AdminToolbar } from 'admin-tools/AdminToolbar/AdminToolbar';
import { FrontEndAdminToolbar } from 'admin-tools/FrontEndAdminToolbar/FrontEndAdminToolbar';
import { DevToolbarFrontEnd } from 'dev-tools/_DevToolbarFrontEnd/DevToolbarFrontEnd';

export const Footer: FC = () => {
  const location = useLocation();

  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }} className="col col-left">
          {location.pathname.startsWith('/admin') ? <AdminToolbar /> : <FrontEndAdminToolbar />}
        </Flex>
        <Flex justify="end" style={{ flex: '1' }} className="col col-right">
          {location.pathname.startsWith('/admin') ? <></> : <DevToolbarFrontEnd />}
        </Flex>
      </Flex>
    </footer>
  );
};
