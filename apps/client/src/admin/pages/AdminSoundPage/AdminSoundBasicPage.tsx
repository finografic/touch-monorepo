import React from 'react';
import { Col, Row } from 'react-grid-system';

import { Flex, Slider, Spinner, Text } from '@radix-ui/themes';

import { useGlobalVolume } from 'hooks/useGlobalVolume';
import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';
import { stopAllAudio } from 'utils/soundCache.utils';

import { AdminContentLayout, AdminSection } from '../..';
import { SoundConfigurationSection } from './components';
import { StopIcon } from 'styles/icons';
import { styles } from './AdminSoundPage.styles';

export const AdminSoundBasicPage: React.FC = () => {
  // Global volume management
  const { volume, updateVolume } = useGlobalVolume();

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
        css={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading sound settings...</Text>
        </Flex>
      </AdminContentLayout>
    );
  }

  return (
    <section css={styles} className="admin-content-page">
      <AdminContentLayout
        title="Sound Management"
        subtitle="User"
        description="Upload and configure sound files for timer events"
        css={styles}
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
                  // mr="0"
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
                  gap="2"
                  align="center"
                  style={{ width: '100%', fontSize: '1.5rem', fontWeight: '600', padding: '0 4rem' }}
                  mr="8"
                  pr="8"
                >
                  <Text size="2" weight="medium" color="gray">
                    Volume
                  </Text>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => updateVolume(value[0])}
                    max={100}
                    min={0}
                    step={1}
                    size="3"
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
    </section>
  );
};
