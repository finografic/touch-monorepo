import React from 'react';
import type { LanguageInfo } from '@workspace/i18n/types';

import languagesData from 'components/LanguageSelector/languages/languages.data.min.json';

interface LaungaugeDataStatsProps {
  selectedLanguages: LanguageInfo[];
  totalCountries?: number;
  totalLanguages?: number;
}

export const LaungaugeDataStats: React.FC<LaungaugeDataStatsProps> = ({
  selectedLanguages,
  totalCountries = languagesData.length,
  totalLanguages = languagesData.reduce(
    (acc, country) => acc + (country.languages ? Object.keys(country.languages).length : 0),
    0,
  ),
}) => {
  return (
    <span className="laungauge-data-stats">
      <span style={{ color: 'var(--colors-fg)' }}>
        {totalCountries}
      </span>{' '}
      <span>Countries</span>
      <span style={{ margin: '0 2rem', color: 'var(--colors-grey-lighter)' }}>•</span>
      <span style={{ color: 'var(--colors-fg)' }}>
        {totalLanguages}
      </span>{' '}
      <span>Curated Languages</span>
      <span style={{ margin: '0 2rem', color: 'var(--colors-grey-lighter)' }}>•</span>
      <span style={{ color: 'var(--colors-fg)' }}>
        {selectedLanguages.length}
      </span>{' '}
      <span>Selected</span>
    </span>
  );
};
