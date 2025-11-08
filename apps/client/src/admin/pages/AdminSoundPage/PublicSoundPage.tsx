import React from 'react';
import { Col, Row } from 'react-grid-system';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import { ListBoxSelect } from 'admin/pages/AdminSoundPage/ListBoxSelect';
import { VolumeSlider } from 'admin/pages/AdminSoundPage/VolumeSlider';
import { VolumeSlider as VolumeSliderV2 } from 'admin/pages/AdminSoundPage/VolumeSlider-V2';
import { ListBox } from 'primereact/listbox';

import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';

import { stopAllAudio } from 'utils/soundCache.utils';
import { AdminPageLayout, AdminSection } from '../..';
import { SoundConfigurationSection } from './components';
import { StopIcon } from 'styles/icons';
import { styles } from './AdminSoundPage.styles';

export const PublicSoundPage: React.FC = () => {
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  if (isLoadingFiles || isLoadingSettings) {
    return (
      <AdminPageLayout
        title="Sound Management"
        subtitle="User"
        description="Upload and configure sound files for timer events"
        styles={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading sound settings...</Text>
        </Flex>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
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
            <ListBoxSelect soundFiles={soundFiles} soundSettings={soundSettings} soundType="alarm" />
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
              <Flex direction="column" gap="4" align="center" width="100%" mr="8" pr="8">
                {/* <VolumeSliderV2 /> */}
                <VolumeSlider />
              </Flex>
            </Flex>
          </Col>
        </Row>
      </AdminSection>
    </AdminPageLayout>
  );
};
