import { Container, Flex } from '@radix-ui/themes';
import { styles } from './Header.styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from 'providers/SessionProvider/SessionContext';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentSessionId } = useSession();

  return (
    <header css={styles}>
      <Container size="4">
        <Flex justify="between" align="center" width="100%" style={{ display: 'flex' }}>
          {/* ====================================================================== */}
          <Flex justify="start" style={{ flex: '3' }}>
            {/* Space for future content */}
          </Flex>

          {/* Center column - 6 parts */}
          <Flex justify="center" style={{ flex: '6' }}>
            <Flex direction="column" justify="end" align="center" style={{ flex: '6' }}>
              <h1
                onClick={() => {
                  navigate('/');
                  window.location.reload();
                }}
              >
                {t('app.title')}
              </h1>
              {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
            </Flex>
          </Flex>

          <Flex justify="end" style={{ flex: '3' }}>
            {/* <LanguageSelector onLanguageChange={handleLanguageChange} /> */}
            {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
          </Flex>
          {/* ====================================================================== */}
        </Flex>
      </Container>
    </header>
  );
};
