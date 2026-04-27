import React from 'react';
import { Col, Row } from '@finografic/design-system/grid';

import { AdminPageLayout, AdminSection } from 'admin/components';

import { useGetImageFiles, useGetImageSettings } from 'queries/images';

import { SelectedImageSection } from './components';
import { styles } from './AdminImagesPage.styles';

export const PublicImagesPage: React.FC = () => {
  const { data: imageFiles = [], isLoading: isLoadingFiles } = useGetImageFiles('product');
  const { data: imageSettings = { product: null, label: null }, isLoading: isLoadingSettings } =
    useGetImageSettings();

  return (
    <AdminPageLayout
      title={'admin.pages.images_public.title'}
      description={'admin.pages.images_public.description'}
      isLoading={isLoadingFiles || isLoadingSettings}
      styles={styles}
    >
      <AdminSection
        title="Product image"
        description="Select which image file to use when a default is required"
      >
        <Row justify="space-between" align="center">
          <Col xs={12} lg={7}>
            <SelectedImageSection
              imageFiles={imageFiles}
              imageSettings={imageSettings}
              imageCategory="product"
            />
          </Col>
        </Row>
      </AdminSection>
    </AdminPageLayout>
  );
};
