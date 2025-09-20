import { Container, Flex } from '@radix-ui/themes';
import { styles } from './Header.styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSession } from 'providers/SessionProvider/SessionContext';
import { ThemeToggle } from 'components/ThemeToggle';
import { useAppConfig } from 'providers/AppConfigProvider';
import { usePagination } from 'providers/PaginationProvider/PaginationContext';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSessionId } = useSession();
  const { currentLanguage } = useAppConfig();
  const { isNextDisabled } = usePagination();

  return (
    <header css={styles}>
      <Container size="4">
        <Flex justify="between" align="center" width="100%" className="row-header">
          {/* ====================================================================== */}
          <Flex justify="start" style={{ flex: '3' }} className="col col-header-left">
            {/* Space for future content */}
          </Flex>

          {/* Center column - 6 parts */}
          <Flex justify="center" style={{ flex: '6' }} className="col col-header-center">
            <Flex direction="column" justify="end" align="center" style={{ flex: '6' }}>
              <h1
                onClick={() => {
                  navigate('/');
                  window.location.reload();
                }}
              >
                {t('app.title')} <span className="current-language">({currentLanguage})</span>
              </h1>
              {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
            </Flex>
          </Flex>

          <Flex justify="end" style={{ flex: '3' }} className="col col-header-right">
            <ThemeToggle />
            {/* <LanguageSelector onLanguageChange={handleLanguageChange} /> */}
            {/* <pre className="current-language">{String(currentSessionId)}</pre> */}
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};
