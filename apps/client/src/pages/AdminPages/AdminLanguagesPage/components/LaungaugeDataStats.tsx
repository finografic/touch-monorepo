import React from 'react';
import { Text } from '@radix-ui/themes';
import languagesData from 'components/LanguageSelector/languages/languages.data.min.json';
import type { LanguageInfo } from 'types/models/supported-language.model';

interface LaungaugeDataStatsProps {
  selectedLanguages: LanguageInfo[];
}

export const LaungaugeDataStats: React.FC<LaungaugeDataStatsProps> = ({ selectedLanguages }) => {
  return (
    <Text size="3" className="laungauge-data-stats">
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {languagesData.length}
      </Text>{' '}
      <Text color="gray">Countries</Text>
      <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {languagesData.reduce(
          (acc, country) => acc + (country.languages ? Object.keys(country.languages).length : 0),
          0,
        )}
      </Text>{' '}
      <Text color="gray">Total Languages</Text>
      <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
      <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
        {selectedLanguages.length}
      </Text>{' '}
      <Text color="gray">Selected</Text>
    </Text>
  );
};
