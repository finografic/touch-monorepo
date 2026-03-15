import React from 'react';
import { Col, Row } from '@finografic/design-system/grid';

import { AdminPageLayout, AdminSection } from 'admin/components';
import { VolumeSlider } from 'admin/pages/AdminSoundPage/VolumeSlider';
import { Flex } from 'styled-system/jsx';

import { useGetSoundFiles, useGetSoundSettings } from 'queries/sounds';

import { SoundConfigurationSection } from './components';
import { styles } from './AdminSoundPage.styles';

export const PublicSoundPage: React.FC = () => {
  const { data: soundFiles = [], isLoading: isLoadingFiles } = useGetSoundFiles('alarm');
  const { data: soundSettings = { alarm: null, finish: null }, isLoading: isLoadingSettings } =
    useGetSoundSettings();

  return (
    <AdminPageLayout
      title={'admin.pages.sound_public.title'}
      description={'admin.pages.sound_public.description'}
      isLoading={isLoadingFiles || isLoadingSettings}
      styles={styles}
    >
      <AdminSection title="Alarm Sound" description="Select which sound file to use for timer alarm events">
        <Row justify="space-between" align="center">
          <Col xs={12} lg={7}>
            <SoundConfigurationSection
              soundFiles={soundFiles}
              soundSettings={soundSettings}
              soundType="alarm"
            />
          </Col>
          <Col xs={12} lg={5}>
            <Flex direction="row" pt={2} align="center" className="volume-control">
              <VolumeSlider />
            </Flex>
          </Col>
        </Row>
      </AdminSection>
    </AdminPageLayout>
  );
};
