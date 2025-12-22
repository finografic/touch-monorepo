import type React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLanguagesPage, PublicLanguagesPage } from 'admin/pages/AdminLanguagesPage';
import { PublicModePage } from 'admin/pages/AdminModePage';
import { AdminModePageDEV } from 'admin/pages/AdminModePage/AdminModePage-DEV';
import { AdminOrdersPage } from 'admin/pages/AdminOrdersPage/AdminOrdersPage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { PublicRelaysPage } from 'admin/pages/AdminRelaysPage/PublicRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage, PublicSoundPage } from 'admin/pages/AdminSoundPage';
import { TranslationsProductPage } from 'admin/pages/TranslationsProductPage';
import {
  CoffeeIcon,
  EditIcon,
  GridIcon,
  LanguageIcon,
  ListIcon,
  SettingsIcon,
  VolumeIcon,
  ZapIcon,
} from 'styles/icons';
import { TranslationsPage } from 'admin/pages/TranslationsPage';
import { AdminOrdersListPage } from 'admin/pages/AdminOrdersPage/AdminOrdersListPage';

export type AuthRoles = 'public' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  key: string;
  path?: string; // Optional for group nodes (children define actual paths)
  element: Partial<Record<AuthRoles, React.ComponentType | null>>;
}

/** Main admin route entry interface - composed of base + optional consumer-specific properties */
export interface AdminRouteEntry extends AdminRouteBase {
  hasNav?: Partial<Record<AuthRoles, boolean>>;
  hasCard?: Partial<Record<AuthRoles, boolean>>;
  icon?: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
  children?: AdminRouteEntry[]; // Sub-routes for dropdown grouping
  // Optional props for specific components (e.g., TranslationsPage)
  namespace?: 'ui' | 'app' | 'admin';
  groups?: string[];
}

export const ADMIN_ENTRIES: AdminRouteEntry[] = [
  // DASHBOARD (accessible to all - index route) ============================ //
  {
    key: 'dashboard',
    path: '/admin',
    element: {
      public: Outlet,
      admin: Outlet,
    },
    hasNav: { public: true, admin: true }, // no nav
    hasCard: { public: false, admin: false }, // no card
  },
  // PUBLIC ENTRIES (accessible without login) ============================== //
  {
    key: 'items',
    path: '/admin/items', // orders (parent route for list + edit)
    element: {
      public: null,
      admin: AdminOrdersPage, // ✅ Parent component with Outlet
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: ListIcon,
    color: 'blue',
    children: [
      {
        key: 'order-list',
        path: 'order-list',
        element: {
          public: null,
          admin: () => <AdminOrdersListPage />,
        },
      },
      {
        key: 'translationsApp',
        path: 'new',
        element: {
          public: null,
          admin: AdminOrderEditPage,
        },
      },
      {
        key: 'translationsAdmin',
        path: ':orderId',
        element: {
          public: null,
          admin: AdminOrdersPage,
        },
      },
    ],
  },
  {
    key: 'slotConfig',
    path: '/admin/slots-config',
    element: {
      public: null,
      admin: AdminSlotsConfigPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: GridIcon,
    color: 'orange',
  },

  {
    key: 'relays',
    path: '/admin/relays',
    element: {
      public: null,
      admin: AdminRelaysPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: ZapIcon,
    color: 'green',
  },

  {
    key: 'mode',
    path: '/admin/mode', // default mode (public)
    element: {
      public: PublicModePage,
      admin: AdminModePageDEV,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: CoffeeIcon,
    color: 'blue',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: PublicSoundPage,
      admin: AdminSoundPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: VolumeIcon,
    color: 'crimson',
  },
  {
    key: 'maintenance',
    path: '/admin/maintenance', // relays (public)
    element: {
      public: PublicRelaysPage,
      admin: null,
    },
    hasNav: { public: true, admin: false },
    hasCard: { public: true, admin: false },
    icon: SettingsIcon,
    color: 'orange',
  },

  // AUTHENTICATED ENTRIES (only visible as admin) ========================== //
  {
    key: 'translations',
    path: '/admin/translations-product',
    element: {
      public: null,
      admin: TranslationsProductPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: EditIcon,
    color: 'purple',
  },
  // TRANSLATIONS LABELS GROUP (dropdown with 3 children) ================== //
  {
    key: 'translationsLabels',
    path: '/admin/translations', // Default/first child path (for active state detection)
    element: {
      public: null,
      admin: TranslationsPage, // Parent uses first child's component
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: EditIcon,
    color: 'purple',
    children: [
      {
        key: 'translationsUi',
        path: 'ui',
        element: {
          public: null,
          admin: () => <TranslationsPage domain="ui" groups={['buttons', 'tables', 'time']} />,
        },
      },
      {
        key: 'translationsApp',
        path: 'app',
        element: {
          public: null,
          admin: () => <TranslationsPage domain="app" groups={['pages', 'components', 'orders']} />,
        },
      },
      {
        key: 'translationsAdmin',
        path: 'admin',
        element: {
          public: null,
          admin: () => <TranslationsPage domain="admin" groups={['pages']} />,
        },
      },
    ],
  },
  // LANGUAGE ENTRY (public and admin) ====================================== //
  {
    key: 'languages',
    path: '/admin/languages',
    element: {
      public: () => <PublicLanguagesPage />,
      admin: () => <AdminLanguagesPage />,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: LanguageIcon,
    color: 'green',
  },
];
