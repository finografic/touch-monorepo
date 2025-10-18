import React, { useCallback } from 'react';

import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { SelectCustom } from 'forms/SelectCustom';
import { useUpdateSoundSettings } from 'queries/sounds';

import { useToast } from 'components/Toast';
import { useAuth } from 'providers/AuthProvider';
import { SpeakerLoudIcon } from 'styles/icons';
import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';
import { playSoundByPath } from 'utils/soundCache.utils';

import { styles } from './SoundConfigurationSection.styles';

interface SoundConfigurationSectionProps {
  soundFiles: SoundFile[];
  soundSettings: SoundSettings;
  soundType: SoundType;
}

export const SoundConfigurationSection: React.FC<SoundConfigurationSectionProps> = ({
  soundFiles,
  soundSettings,
  soundType,
}) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateSoundSettings();

  // Handle sound selection
  const handleSoundSelection = useCallback(
    async (fileId: string | null) => {
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
    [soundSettings, soundFiles, updateSettingsMutation, toast, soundType],
  );

  // Test sound playback using file path
  const testSound = useCallback(
    async (fileId: string) => {
      try {
        const soundFile = soundFiles.find((file) => file.id === fileId);
        if (!soundFile || !soundFile.filePath) {
          throw new Error('Sound file not found or missing file path');
        }

        await playSoundByPath(soundFile.filePath);
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
        {/* <Heading size="3">{soundType === 'alarm' ? 'Alarm Sound' : 'Finish Sound'} Configuration</Heading> */}

        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-label">
            <Text weight="bold">{soundType === 'alarm' ? 'Alarm Sound:' : 'Finish Sound:'}</Text>
          </Box>
          <Box className="sound-select-container">
            <SelectCustom
              value={soundSettings[soundType] || 'none'}
              onSelect={(value) => handleSoundSelection(value === 'none' ? null : value)}
              disabled={updateSettingsMutation.isPending}
              placeholder={`Select ${soundType} sound...`}
              options={[
                { value: 'none', label: 'None' },
                ...soundFiles.map((file) => ({
                  value: file.id,
                  label: file.name,
                })),
              ]}
            />
          </Box>
          {soundSettings[soundType] && (
            <Button
              size="3"
              variant="soft"
              color="green"
              onClick={() => testSound(soundSettings[soundType]!)}
              className="test-button"
            >
              <SpeakerLoudIcon className="icon-speaker" color="green" />
              Test
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
