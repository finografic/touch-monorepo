import React from 'react';
import { Text } from '@radix-ui/themes';
import languagesData from 'components/LanguageSelector/languages/languages.data.min.json';
import type { LanguageInfo } from 'types/language.types';

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
    <Text size="3" className="laungauge-data-stats">
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {totalCountries}
      </Text>{' '}
      <Text color="gray">Countries</Text>
      <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {totalLanguages}
      </Text>{' '}
      <Text color="gray">Curated Languages</Text>
      <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {selectedLanguages.length}
      </Text>{' '}
      <Text color="gray">Selected</Text>
    </Text>
  );
};
