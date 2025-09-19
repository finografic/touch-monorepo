import React, { useCallback } from 'react';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { SpeakerLoudIcon } from 'styles/icons';

import { useToast } from 'components/Toast';
import { SelectCustom } from 'forms/SelectCustom';
import { type SoundFile, type SoundSettings, useUpdateSoundSettings } from 'api/hooks/useSounds';
import { playSoundByPath } from 'utils/soundCache.utils';
import { styles } from './SoundConfigurationSection.styles';

interface SoundConfigurationSectionProps {
  soundFiles: SoundFile[];
  soundSettings: SoundSettings;
}

export const SoundConfigurationSection: React.FC<SoundConfigurationSectionProps> = ({
  soundFiles,
  soundSettings,
}) => {
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateSoundSettings();

  // Handle sound selection
  const handleSoundSelection = useCallback(
    async (soundType: 'tick' | 'finish', fileId: string | null) => {
      try {
        const newSettings = {
          ...soundSettings,
          [soundType]: fileId,
        };

        await updateSettingsMutation.mutateAsync(newSettings);

        const selectedFile = soundFiles.find((file) => file.id === fileId);
        if (selectedFile) {
          toast({
            variant: 'success',
            message: `${soundType} sound updated`,
            subText: `Now using: ${selectedFile.name}`,
          });
        }
      } catch (error) {
        toast({
          variant: 'error',
          message: 'Failed to update sound settings',
          subText: 'Please try again',
        });
      }
    },
    [soundSettings, soundFiles, updateSettingsMutation, toast],
  );

  // Test sound playback using file path
  const testSound = useCallback(
    async (fileId: string) => {
      try {
        const soundFile = soundFiles.find((file) => file.id === fileId);
        if (!soundFile || !soundFile.filePath) {
          throw new Error('Sound file not found or missing file path');
        }

        await playSoundByPath(soundFile.filePath, 0.3);
        toast({
          variant: 'success',
          message: 'Sound played successfully',
          subText: 'Check your audio settings if you cannot hear it',
        });
      } catch (error) {
        console.error('Error playing sound:', error);
        toast({
          variant: 'error',
          message: 'Could not play sound',
          subText: 'Check browser permissions or try again',
        });
      }
    },
    [soundFiles, toast],
  );

  return (
    <div css={styles} className="sound-configuration-section">
      <Flex direction="column" gap="3">
        <Heading size="3">Timer Event Sounds</Heading>

        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-label">
            <Text weight="bold">Tick Sound:</Text>
          </Box>
          <Box className="sound-select-container">
            <SelectCustom
              value={soundSettings.tick || 'none'}
              onSelect={(value) => handleSoundSelection('tick', value === 'none' ? null : value)}
              disabled={updateSettingsMutation.isPending}
              placeholder="Select tick sound..."
              options={[
                { value: 'none', label: 'None' },
                ...soundFiles.map((file) => ({
                  value: file.id,
                  label: file.name,
                })),
              ]}
            />
          </Box>
          {soundSettings.tick && (
            <Button
              size="1"
              variant="soft"
              onClick={() => testSound(soundSettings.tick!)}
              className="test-button"
            >
              <SpeakerLoudIcon className="icon-speaker" />
              Test
            </Button>
          )}
        </Flex>

        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-label">
            <Text weight="bold">Finish Sound:</Text>
          </Box>
          <Box className="sound-select-container">
            <SelectCustom
              value={soundSettings.finish || 'none'}
              onSelect={(value) => handleSoundSelection('finish', value === 'none' ? null : value)}
              disabled={updateSettingsMutation.isPending}
              placeholder="Select finish sound..."
              options={[
                { value: 'none', label: 'None' },
                ...soundFiles.map((file) => ({
                  value: file.id,
                  label: file.name,
                })),
              ]}
            />
          </Box>
          {soundSettings.finish && (
            <Button
              size="1"
              variant="soft"
              onClick={() => testSound(soundSettings.finish!)}
              className="test-button"
            >
              <SpeakerLoudIcon className="icon-speaker" />
              Test
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
