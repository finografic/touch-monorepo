import React from 'react';
import type { LanguageInfo } from '@workspace/i18n/types';

import { Flex } from 'styled-system/jsx';

interface LanguagesListSelectedProps {
  language: LanguageInfo;
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
        <span>
          {language.label} - {language.code}
        </span>

        <span>
          {language.countryName || 'Unknown Country'}
          {language.nativeLabel && language.nativeLabel !== language.label && <> • {language.nativeLabel}</>}
        </span>
      </Flex>
    </Flex>
  );
};
