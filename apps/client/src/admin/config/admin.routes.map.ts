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

export type AuthRoles = 'public' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  id: string;
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
}

export const ADMIN_ENTRIES: AdminRouteEntry[] = [
  // DASHBOARD (accessible to all - index route) ============================ //
  {
    id: 'dashboard',
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
    id: 'items',
    path: '/admin/items', // orders (parent route for list + edit)
    element: {
      public: null,
      admin: AdminOrdersPage, // ✅ Parent component with Outlet
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: ListIcon,
    color: 'blue',
  },
  {
    id: 'slotConfig',
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
    id: 'relays',
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
    id: 'mode',
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
    id: 'sounds',
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
    id: 'maintenance',
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
    id: 'translations',
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
    id: 'translationsLabels',
    path: '/admin/translations/ui', // Default/first child path (for active state detection)
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
        id: 'translationsUi',
        path: '/admin/translations/ui',
        element: {
          public: null,
          admin: TranslationsPage,
        },
      },
      {
        id: 'translationsApp',
        path: '/admin/translations/app',
        element: {
          public: null,
          admin: TranslationsPage,
        },
      },
      {
        id: 'translationsAdmin',
        path: '/admin/translations/admin',
        element: {
          public: null,
          admin: TranslationsPage,
        },
      },
    ],
  },
  // LANGUAGE ENTRY (public and admin) ====================================== //
  {
    id: 'languages',
    path: '/admin/languages',
    element: {
      public: PublicLanguagesPage,
      admin: AdminLanguagesPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: LanguageIcon,
    color: 'green',
  },
];
