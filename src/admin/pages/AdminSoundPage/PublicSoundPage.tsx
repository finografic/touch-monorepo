import React, { useCallback } from 'react';
import { Col, Row } from 'react-grid-system';

import { Flex, Spinner, Text } from '@radix-ui/themes';

import { useGlobalVolume } from 'hooks/useGlobalVolume';
import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';
import { stopAllAudio } from 'utils/soundCache.utils';

import { AdminContentLayout, AdminSection } from '../..';
import { SoundConfigurationSection } from './components';
import { StopIcon } from 'styles/icons';
import { styles } from './AdminSoundPage.styles';

export const PublicSoundPage: React.FC = () => {
  // Global volume management - handles state, storage, and audio updates
  const { volume, updateVolume } = useGlobalVolume();

  // Handle volume change - immediate updates for responsive UI
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      updateVolume(newVolume);
    },
    [updateVolume],
  );

  // API hooks - only get alarm sounds for basic page
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  if (isLoadingFiles || isLoadingSettings) {
    return (
      <AdminContentLayout
        title="Sound Management"
        subtitle="User"
        description="Upload and configure sound files for timer events"
        styles={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading sound settings...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout
      title="Sound Management"
      subtitle="User"
      description="Upload and configure sound files for timer events"
      styles={styles}
    >
      <AdminSection
        title="Alarm Sound Configuration"
        description="Select which sound file to use for timer alarm events"
      >
        <Row justify="between" align="center">
          <Col xs={6}>
            <SoundConfigurationSection
              soundFiles={soundFiles}
              soundSettings={soundSettings}
              soundType="alarm"
            />
          </Col>
          <Col xs={6}>
            <Flex direction="row" gap="2" align="center" className="volume-control">
              <Flex
                direction="column"
                gap="2"
                align="center"
                style={{ width: '60px', fontSize: '1.5rem', fontWeight: '600', padding: '0' }}
              >
                {/* Panic button - stop all audio */}
                <div className="button-box">
                  <button
                    className="button button-panic"
                    onClick={stopAllAudio}
                    title="Stop All Audio (Panic)"
                  >
                    <StopIcon color="orange" />
                  </button>
                </div>
              </Flex>
              <Flex
                direction="column"
                gap="4"
                align="center"
                style={{ width: '100%', fontSize: '1.5rem', fontWeight: '600', padding: '0 6rem 2.33rem' }}
                mr="8"
                pr="8"
              >
                <Text size="3" weight="medium" color="gray" mt="7">
                  Volume
                </Text>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                  }}
                  className="volume-slider"
                />
                <Text size="3" color="gray">
                  {volume}%
                </Text>
              </Flex>
            </Flex>
          </Col>
        </Row>
      </AdminSection>
    </AdminContentLayout>
  );
};
