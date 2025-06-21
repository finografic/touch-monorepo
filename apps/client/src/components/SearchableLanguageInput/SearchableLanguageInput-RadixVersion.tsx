import React, { useMemo, useState } from 'react';
import { matchSorter } from 'match-sorter';
import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { Country } from '../LanguageSelector/languages/country.types';

interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

interface SearchableLanguageInputProps {
  countriesData: Country[];
  onLanguageSelect: (option: LanguageOption) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchableLanguageInputRadix: React.FC<SearchableLanguageInputProps> = ({
  countriesData,
  onLanguageSelect,
  placeholder = 'Search languages, countries, or codes...',
  disabled = false,
}) => {
  const [searchValue, setSearchValue] = useState('');

  // Flatten countries data into searchable language options
  const languageOptions = useMemo(() => {
    const options: LanguageOption[] = [];

    countriesData.forEach((country) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([langCode, langName]) => {
          const nativeName = country.name.nativeName?.[langCode]?.common;

          options.push({
            languageCode: langCode,
            languageName: langName,
            countryName: country.name.common,
            countryCode: country.cca2,
            flagUrl: country.flags.png,
            nativeName,
            emoji: country.flag || '',
          });
        });
      }
    });

    return options;
  }, [countriesData]);

  // Use match-sorter for intelligent search
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return languageOptions.slice(0, 20); // Show first 20 when no search

    return matchSorter(languageOptions, searchValue, {
      keys: ['languageCode', 'languageName', 'countryName', 'countryCode', 'nativeName'],
      threshold: matchSorter.rankings.CONTAINS,
    }).slice(0, 10);
  }, [languageOptions, searchValue]);

  const handleValueChange = (value: string) => {
    const selectedOption = languageOptions.find(
      (option) => `${option.languageCode}-${option.countryCode}` === value,
    );
    if (selectedOption) {
      onLanguageSelect(selectedOption);
      setSearchValue(''); // Reset search
    }
  };

  return (
    <Flex direction="column" gap="3">
      {/* Search Input */}
      <TextField.Root
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        size="3"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      {/* Radix Select with filtered options */}
      <Select.Root onValueChange={handleValueChange} disabled={disabled}>
        <Select.Trigger placeholder="Choose from filtered results..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>
              Languages ({filteredOptions.length} {searchValue ? 'matching' : 'available'})
            </Select.Label>
            {filteredOptions.map((option) => (
              <Select.Item
                key={`${option.languageCode}-${option.countryCode}`}
                value={`${option.languageCode}-${option.countryCode}`}
              >
                <Flex align="center" gap="3">
                  <img
                    src={option.flagUrl}
                    alt={`${option.countryName} flag`}
                    width="20"
                    height="15"
                    style={{ borderRadius: '2px' }}
                  />
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text weight="bold" size="2">
                        {option.languageName}
                      </Text>
                      <Text size="1" color="gray">
                        ({option.languageCode})
                      </Text>
                      {option.emoji && <Text size="2">{option.emoji}</Text>}
                    </Flex>
                    <Flex align="center" gap="2">
                      <Text size="1" color="gray">
                        {option.countryName}
                      </Text>
                      {option.nativeName && option.nativeName !== option.languageName && (
                        <>
                          <Text size="1" color="gray">
                            •
                          </Text>
                          <Text size="1" color="gray">
                            {option.nativeName}
                          </Text>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};
