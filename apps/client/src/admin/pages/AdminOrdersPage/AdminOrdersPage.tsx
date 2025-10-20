import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Tabs } from '@radix-ui/themes';
import { TabForm } from 'admin/pages/AdminOrdersPage/TabForm';
import { TabList } from 'admin/pages/AdminOrdersPage/TabList';
import clsx from 'clsx';
import type { DialogConfig } from 'components/Dialog';

import { useGetOrdersReadable } from 'queries/orders';

import { AdminContentLayout, AdminSection } from '../..';
import type { ColumnSearchState } from './components/OrdersTable';
import { useOrdersFilter } from './hooks/useOrdersFilter';
import { AddIcon, EditIcon, ListChecksIcon } from 'styles/icons';
import { styles } from './AdminOrdersPage.styles';

export const NUM_TABS = 2;

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId?: string }>();
  const hash = window.location.hash.slice(1);

  const isEditMode = Boolean(orderId);
  const isNewMode = hash === 'new';

  // State for search/filter
  const [searchTerm] = useState('');
  const [columnSearches, setColumnSearches] = useState<ColumnSearchState>({});

  // Fetch orders data at page level
  const { data: ordersData = [], isLoading, error } = useGetOrdersReadable();

  // Filter orders using custom hook
  const { filteredOrders, isFiltered, totalCount, filteredCount, getOrderIndex } = useOrdersFilter({
    ordersData,
    searchTerm,
    columnSearches,
  });

  // Compute title and subtitle based on current mode and data state
  const { title, subtitle } = useMemo(() => {
    if (isEditMode && orderId) {
      const displayIndex = getOrderIndex(orderId);
      return {
        title: 'Editar registro',
        subtitle: displayIndex || orderId,
      };
    }

    if (isNewMode) {
      return {
        title: 'Nuevo registro',
        subtitle: '',
      };
    }

    // List mode
    return {
      title: 'Gestión de configuraciones',
      subtitle: isFiltered ? `${filteredCount} results` : `${totalCount} entries`,
    };
  }, [isEditMode, isNewMode, orderId, isFiltered, filteredCount, totalCount, getOrderIndex]);

  // ======================================================================== //

  const config: DialogConfig = {
    title: '',
    size: '3',
    maxWidth: '400px',
    maxHeight: '60vh',
    minHeight: '280px',
    minWidth: '350px',
    theme: {
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
    tabs: [
      {
        id: 'list',
        label: 'Listado de registros',
        icon: <ListChecksIcon />,
        content: (
          <TabList
            orders={filteredOrders}
            columnSearches={columnSearches}
            onColumnSearchChange={setColumnSearches}
            isLoading={isLoading}
            error={error}
          />
        ),
      },
      isEditMode || isNewMode
        ? isEditMode
          ? {
              id: 'edit',
              label: 'Editar registro',
              icon: <EditIcon />,
              content: <TabForm />,
            }
          : {
              id: 'new',
              label: 'Nuevo registro',
              icon: <AddIcon />,
              content: <TabForm />,
            }
        : {
            id: 'new',
            label: 'Nuevo registro',
            icon: <AddIcon />,
            content: <TabForm />,
          },
    ],
  };

  // ======================================================================== //
  // TAB MANAGEMENT
  // ======================================================================== //

  // Default active tab based on URL state:
  // - /admin/orders/{orderId} → 'edit' tab
  // - /admin/orders#new → 'new' tab
  // - /admin/orders → 'list' tab (default)
  const defaultActiveTab = isEditMode ? 'edit' : isNewMode ? 'new' : 'list';
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab);

  // Sync activeTab when URL changes (e.g., edit → list via navigation)
  React.useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  // Handle tab changes
  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === 'list') {
        navigate('/admin/orders');
      } else if (tab === 'new') {
        navigate('/admin/orders#new');
      }
      // Note: Can't navigate to 'edit' tab directly - requires an orderId from table actions
    },
    [navigate],
  );

  return (
    <AdminContentLayout title={title} subtitle={subtitle} styles={styles}>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
        <Tabs.List>
          {config.tabs.map((tab) => (
            <Tabs.Trigger key={tab.id} value={tab.id} disabled={tab.disabled}>
              {tab.icon ? tab.icon : null} {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <div className={clsx('tab-content')}>
          {config.tabs.map((tab) => (
            <Tabs.Content key={tab.id} id={`tab-content-${tab.id}`} value={tab.id}>
              <AdminSection
                className={clsx(`tab-content-${tab.id}`, isEditMode ? 'mode-edit' : 'mode-new')}
                isLoading={isLoading}
                variant="none"
              >
                {tab.content}
              </AdminSection>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </AdminContentLayout>
  );
};
