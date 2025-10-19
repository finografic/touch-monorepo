import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Spinner, Text } from '@radix-ui/themes';
import { OrdersForm } from 'admin/pages/AdminOrdersPage/components/OrdersForm';
import clsx from 'clsx';
import { useToast } from 'components/Toast';

import { useGetOrderReadableById } from 'queries/orders';

import { AdminSection } from '../..';
// import { styles } from './AdminOrdersPage.styles';

export const TabForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId?: string }>();

  // Determine if we're in edit mode
  const isEditMode = Boolean(orderId);

  // Fetch individual order data when in edit mode
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderReadableById(orderId || '');

  // Handle form submission for both create and update modes
  const handleAddOrder = (formData: {
    modeId: string;
    drinkType: string;
    drinkSubtype?: string;
    volume: string;
    containerType: string;
    defaultTempConsume: number;
    defaultTempFreeze: number;
    timeRows: Array<{
      temperature?: number;
      timeA?: number;
      timeB?: number;
      timeC?: number;
    }>;
  }) => {
    if (isEditMode) {
      // Success message for edit mode - API call is now handled in OrdersForm
      const subtypeText = formData.drinkSubtype ? ` (${formData.drinkSubtype})` : '';
      toast({
        variant: 'success',
        message: 'Order updated successfully!',
        subText: `${formData.drinkType}${subtypeText} ${formData.volume} in ${formData.containerType}`,
      });
      // Navigate back to orders list
      navigate('/admin/orders');
    } else {
      // TODO: Implement actual API call to create order
      // For now, just show success toast
      const subtypeText = formData.drinkSubtype ? ` (${formData.drinkSubtype})` : '';
      toast({
        variant: 'success',
        message: 'Order added successfully!',
        subText: `${formData.drinkType}${subtypeText} ${formData.volume} in ${formData.containerType}`,
      });
    }
  };

  useEffect(
    function initSearchBox() {
      if (!isDrawerOpen) {
        setSearchTerm('');
      }
    },
    [isDrawerOpen],
  );

  if (isEditMode && isOrderLoading) {
    return (
      <Row className="form-section">
        <Col>
          <AdminSection
            className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
            title={isEditMode ? 'Editar registro' : 'Nuevo registro'}
            // isLoading={true}
          >
            <Flex direction="column" gap="4" align="center" justify="center" p="6">
              <Spinner size="3" />
              <Text>Loading {isEditMode ? 'order' : 'orders'} data...</Text>
            </Flex>
          </AdminSection>
        </Col>
      </Row>
    );
  }

  if (isEditMode && orderError) {
    const errorMessage = orderError?.message || 'Unknown error';
    return (
      <Row className="form-section">
        <Col>
          <AdminSection
            className={clsx('admin-section', isEditMode ? 'mode-edit' : 'mode-new')}
            title={isEditMode ? 'Editar registro' : 'Nuevo registro'}
            // error={errorMessage as any}
          >
            <Text color="red">
              Error loading {isEditMode ? 'order' : 'orders'}: {errorMessage}
            </Text>
          </AdminSection>
        </Col>
      </Row>
    );
  }

  return (
    <OrdersForm
      onSubmit={handleAddOrder}
      orderData={isEditMode ? orderData : undefined}
      isEditMode={isEditMode}
    />
  );
};
