import { Flex } from '@radix-ui/themes';
import { styles } from './Footer.styles';

export const Footer = () => {
  return (
    <footer css={styles}>
      <Flex width="100%" justify="between" align="center">
        {/* Left column - 1 part */}
        <Flex justify="start" style={{ flex: '1' }}>
          {/* Space for future content */}
        </Flex>

        {/* Right column - 1 part */}
        <Flex justify="end" style={{ flex: '1' }}>
          {/* Navigation moved to Layout - space for other footer content */}
        </Flex>
      </Flex>
    </footer>
  );
};
