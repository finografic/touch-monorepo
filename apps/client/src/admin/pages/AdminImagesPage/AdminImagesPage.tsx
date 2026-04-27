import React, { useState } from 'react';

import { AdminPageLayout, AdminSection } from 'admin/components';

import { useGetImageFiles, useGetImageSettings } from 'queries/images';

import type { ImageCategory } from 'types/images.types';
import { FileUploadSection, SelectedImageSection, ImageLibrarySection } from './components';
import { styles } from './AdminImagesPage.styles';
import { Col, Row } from '@finografic/design-system/grid';

export const AdminImagesPage: React.FC = () => {
  const { data: imageFiles = [], isLoading: isLoadingFiles } = useGetImageFiles();
  const { data: imageSettings = { product: null, label: null }, isLoading: isLoadingSettings } =
    useGetImageSettings();

  const { data: activeTabFiles = [], isLoading: isLoadingActiveTabFiles } = useGetImageFiles(
    'product',
  );

  return (
    <AdminPageLayout
      title={'admin.pages.images.title'}
      description={'admin.pages.images.description'}
      isLoading={isLoadingFiles || isLoadingSettings || isLoadingActiveTabFiles}
      styles={styles}
    >
      <AdminSection title="Product image configuration">
        {
          /* <Row>
          <Col xs={12} lg={6}> */
        }
        <AdminSection
          title="Default product image"
          description="Select which uploaded file is used as the default product image where applicable"
          variant="border-solid"
        >
          <SelectedImageSection
            imageFiles={activeTabFiles}
            imageSettings={imageSettings}
            imageCategory="product"
          />
        </AdminSection>
        {/* </Col> */}

        {/* <Col xs={12} lg={6}> */}
        <AdminSection
          title="Upload product images"
          description="Add images to the product library (PNG, JPEG, WebP, GIF, SVG)"
          variant="border-solid"
        >
          <FileUploadSection imageCategory="product" />
        </AdminSection>
        {
          /* </Col>
        </Row> */
        }

        {
          /* <Row>
          <Col xs={12}> */
        }
        <AdminSection
          title="Product image library"
          description={`${activeTabFiles.length} product image file(s) available`}
          variant="border-solid"
        >
          <ImageLibrarySection
            imageFiles={activeTabFiles}
            imageSettings={imageSettings}
            imageCategory="product"
          />
        </AdminSection>
        {
          /* </Col>
        </Row> */
        }
      </AdminSection>
    </AdminPageLayout>
  );
};
