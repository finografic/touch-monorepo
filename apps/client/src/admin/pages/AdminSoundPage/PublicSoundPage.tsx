import React from 'react';
import { Col, Row } from 'react-grid-system';

import { Flex } from '@radix-ui/themes';
import { VolumeSlider } from 'admin/pages/AdminSoundPage/VolumeSlider';

import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';
import { AdminPageLayout, AdminSection } from '../..';
import { SoundConfigurationSection } from './components';
import { styles } from './AdminSoundPage.styles';

export const PublicSoundPage: React.FC = () => {
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  return (
    <AdminPageLayout
      title="Sound Management"
      subtitle="User"
      description="Upload and configure sound files for timer events"
      isLoading={isLoadingFiles || isLoadingSettings}
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
            <Flex direction="row" gap="2" pt="2" align="center" className="volume-control">
              <VolumeSlider />
            </Flex>
          </Col>
        </Row>
      </AdminSection>
    </AdminPageLayout>
  );
};
