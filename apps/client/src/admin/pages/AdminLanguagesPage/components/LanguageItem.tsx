import React from 'react';
import type { LanguageInfo } from '@workspace/config/i18n.config';
import type { LanguageInfo as LanguageInfo_2 } from '@workspace/i18n/types';

import { Flex, Text } from '@radix-ui/themes';

interface LanguagesListSelectedProps {
  // language: LanguageInfo;
  language: LanguageInfo_2;
}

export const LanguageItem: React.FC<LanguagesListSelectedProps> = ({ language }) => {
  return (
    <Flex align="stretch" gap="3">
      <Flex className="col col-flag">
        {/* Flag Column */}
        <img
          className="language-flag"
          src={language.flag}
          alt={`${language.label} flag`}
          width="40"
          height="30"
          style={{ borderRadius: '3px' }}
        />
      </Flex>

      {/* Language Info Columns */}
      <Flex direction="column" gap="1" className="col col-names">
        <Text weight="bold" size="3">
          {language.label} - {language.code}
        </Text>

        <Text size="2" color="gray">
          {language.countryName || 'Unknown Country'}
          {language.nativeLabel && language.nativeLabel !== language.label && <> • {language.nativeLabel}</>}
        </Text>
      </Flex>
    </Flex>
  );
};
