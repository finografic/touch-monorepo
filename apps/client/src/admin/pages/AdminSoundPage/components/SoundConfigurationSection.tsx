import React, { useCallback } from 'react';

import { Box, Button, Flex } from '@radix-ui/themes';
import { FieldWrapper } from 'forms/FieldWrapper';
import { SelectCustom } from 'forms/SelectCustom';
import { useToast } from 'components/Toast';

import { useUpdateSoundSettings } from 'queries/sounds';

import { playSoundByPath, stopAllAudio  } from 'utils/soundCache.utils';
import type { SoundFile, SoundSettings, SoundType } from 'types/sounds.types';
import { VolumeIcon, VolumeOffIcon } from 'styles/icons';
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
  const { toast } = useToast();
  const updateSettingsMutation = useUpdateSoundSettings();

  const handleSoundSelection = useCallback(
    async (fileId: string | null) => {
      try {
        const newSettings = { ...soundSettings, [soundType]: fileId };

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
        <Flex gap="4" align="center" className="sound-config-row">
          <Box className="sound-select-container" pb="5">
            <FieldWrapper
              name="sound-selector"
              label={soundType === 'alarm' ? 'Alarm Sound' : 'Finish Sound'}
            >
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
            </FieldWrapper>
          </Box>
          {soundSettings[soundType] && (
            <Flex pt="5" gap="3">
              <Button
                size="3"
                variant="soft"
                color="green"
                onClick={() => testSound(soundSettings[soundType]!)}
                className="test-button"
              >
                <VolumeIcon className="icon-speaker" color="green" />
                Test
              </Button>
              <Button size="3" variant="soft" color="orange" onClick={stopAllAudio} className="test-button">
                <VolumeOffIcon className="icon-speaker" color="orange" />
                Stop
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
