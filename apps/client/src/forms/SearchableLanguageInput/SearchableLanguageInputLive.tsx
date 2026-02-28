import React, { useMemo, useState } from 'react';

import { Box, Flex } from 'styled-system/jsx';

import { useGetFilteredCountries } from '../../queries/countries';

// Define LanguageOption interface locally since the types file doesn't exist
interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

interface SearchableLanguageInputLiveProps {
  onLanguageSelect: (language: LanguageOption) => void;
  placeholder?: string;
  windowSize?: number;
}

/**
 * SearchableLanguageInput that fetches live data from REST Countries API
 * Uses filtered data to show only ~80-100 relevant language options
 */
export const SearchableLanguageInputLive: React.FC<SearchableLanguageInputLiveProps> = ({
  onLanguageSelect,
  placeholder = 'Search languages...',
  windowSize = 40,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: countries, isLoading, error } = useGetFilteredCountries();

  // Transform countries to language options
  const languageOptions = useMemo(() => {
    if (!countries) return [];

    const options: LanguageOption[] = [];

    countries.forEach((country) => {
      const languages = country.languages || {};

      Object.entries(languages).forEach(([code, name]) => {
        options.push({
          languageCode: code,
          languageName: name,
          countryName: country.name.common,
          countryCode: country.cca2,
          flagUrl: country.flags.svg || country.flags.png,
          nativeName: name,
          emoji: country.flag,
        });
      });
    });

    return options;
  }, [countries]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return languageOptions.slice(0, windowSize);

    const term = searchTerm.toLowerCase();
    return languageOptions
      .filter(
        (option) =>
          option.languageName.toLowerCase().includes(term) ||
          option.countryName.toLowerCase().includes(term) ||
          option.languageCode.toLowerCase().includes(term),
      )
      .slice(0, windowSize);
  }, [languageOptions, searchTerm, windowSize]);

  if (isLoading) {
    return (
      <Box p={4}>
        <span>Loading countries from REST Countries API...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <span>Error loading countries: {error.message}</span>
      </Box>
    );
  }

  return (
    <Box>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      />

      {searchTerm && (
        <Box mt={2} style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredOptions.length === 0 ? (
            <span>No languages found</span>
          ) : (
            filteredOptions.map((option, index) => (
              <Flex
                key={`${option.languageCode}-${option.countryCode}-${index}`}
                align="center"
                gap={2}
                p={2}
                style={{
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => onLanguageSelect(option)}
              >
                <img
                  src={option.flagUrl}
                  alt={`${option.countryName} flag`}
                  style={{ width: '20px', height: '15px', objectFit: 'cover' }}
                />
                <Box>
                  <span>{option.languageName}</span>
                  <span>{option.countryName} ({option.languageCode})</span>
                </Box>
              </Flex>
            ))
          )}
        </Box>
      )}

      <span>
        Showing {filteredOptions.length} of {languageOptions.length} languages
        {countries && ` from ${countries.length} countries`}
      </span>
    </Box>
  );
};
