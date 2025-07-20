import type { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import { styles } from './Footer.styles';
import { useLocation } from 'react-router-dom';
import { AdminToolbar } from 'admin-tools/AdminToolbar/AdminToolbar';
import { FrontEndAdminToolbar } from 'admin-tools/FrontEndAdminToolbar/FrontEndAdminToolbar';
import { DevToolbar } from 'dev-tools/DevToolbar/DevToolbar';
import { FrontEndDevToolbar } from 'dev-tools/FrontEndDevToolbar/FrontEndDevToolbar';

export const Footer: FC = () => {
  const location = useLocation();

  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }}>
          {location.pathname.startsWith('/admin') ? <AdminToolbar /> : <FrontEndAdminToolbar />}
        </Flex>
        <Flex justify="end" style={{ flex: '1' }}>
          {location.pathname.startsWith('/admin') ? <DevToolbar /> : <FrontEndDevToolbar />}
        </Flex>
      </Flex>
    </footer>
  );
};
