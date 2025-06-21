import { Flex } from '@radix-ui/themes';
import { styles } from './Footer.styles';
import { AdminToolbar } from 'admin-tools/AdminToolbar/AdminToolbar';

export const Footer = () => {
  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        <Flex justify="start" style={{ flex: '1' }}>
          <AdminToolbar />
        </Flex>
        <Flex justify="end" style={{ flex: '1' }}>
          {/* Navigation moved to Layout - space for other footer content */}
        </Flex>
      </Flex>
    </footer>
  );
};
