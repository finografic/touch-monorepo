import { Button, Container, DropdownMenu, Flex } from '@radix-ui/themes';
import { ChevronDownIcon, GlobeIcon } from '@radix-ui/react-icons';
import { useRouteConfig } from 'routes/hooks/useRouteConfig';
import { styles } from './Header.styles';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { colors } from 'styles';

export const Header = () => {
  const location = useLocation();
  const pageContent = useContent();
  const { route } = useRouteConfig();
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'ES', label: 'Español' },
    { code: 'CAT', label: 'Català' },
  ];

  useEffect(() => {
    // pageContent.setContentTitle('');
  }, [location.pathname, pageContent]);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // TODO: Implement actual language switching logic here
    console.log('Language changed to:', languageCode);
  };

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
            <h1>{pageContent?.title || route?.title}</h1>
          </Flex>

          <Flex justify="end" style={{ flex: '3' }}>
            <span className="language-selector">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="2" style={{ color: colors.grey }}>
                    <GlobeIcon />
                    {selectedLanguage}
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content style={{ backgroundColor: colors.background }}>
                  {languages.map((language) => (
                    <DropdownMenu.Item
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      style={{
                        color: selectedLanguage === language.code ? colors.info : colors.white,
                      }}
                    >
                      {language.code} - {language.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </span>
          </Flex>
          {/* ====================================================================== */}
        </Flex>
      </Container>
    </header>
  );
};
