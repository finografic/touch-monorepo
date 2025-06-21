import { Flex } from '@radix-ui/themes';
import { styles } from './Footer.styles';
import { useLocation } from 'react-router-dom';
import { AdminTools } from 'admin-tools/AdminTools';
import { FrontEndAdminTools } from 'admin-tools/FrontEndAdminTools';

export const Footer = () => {
  const location = useLocation();

  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }}>
          {location.pathname.startsWith('/admin') ? <AdminTools /> : <FrontEndAdminTools />}
        </Flex>
        <Flex justify="end" style={{ flex: '1' }}>
          {/* Navigation moved to Layout - space for other footer content */}
        </Flex>
      </Flex>
    </footer>
  );
};
