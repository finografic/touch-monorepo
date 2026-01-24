import type React from 'react';
import { Outlet } from 'react-router-dom';

import { AdminLanguagesPage, PublicLanguagesPage } from 'admin/pages/AdminLanguagesPage';
import { AdminModePage } from 'admin/pages/AdminModePage/AdminModePage';
import { PublicModePage } from 'admin/pages/AdminModePage/PublicModePage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { PublicRelaysPage } from 'admin/pages/AdminRelaysPage/PublicRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage, PublicSoundPage } from 'admin/pages/AdminSoundPage';
import { TranslationsPage } from 'admin/pages/Translations/TranslationsPage';
import { TranslationsProductPage } from 'admin/pages/Translations/TranslationsProductPage';

import {
  CoffeeIcon,
  EditIcon,
  GridIcon,
  LanguageIcon,
  ListIcon,
  VolumeIcon,
  ZapIcon,
} from 'styles/icons';

export type AuthRoles = 'public' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  id: string;
  path?: string; // Optional for group nodes (children define actual paths)
  element: Partial<Record<AuthRoles, React.ComponentType | null>>;
}

/** Main admin route entry interface - composed of base + optional consumer-specific properties */
export interface AdminRouteConfig extends AdminRouteBase {
  hasNav?: Partial<Record<AuthRoles, boolean>>;
  hasCard?: Partial<Record<AuthRoles, boolean>>;
  icon?: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
  children?: AdminRouteConfig[]; // Sub-routes for nested routes (e.g., items/new, items/:id)
}

export const ADMIN_ROUTE_CONFIGS: AdminRouteConfig[] = [
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
      admin: Outlet, // ✅ Parent component with Outlet
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: ListIcon,
    color: 'blue',
  },
  {
    id: 'slots',
    path: '/admin/slots',
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
      public: PublicRelaysPage,
      admin: AdminRelaysPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: ZapIcon,
    color: 'green',
  },
  {
    id: 'mode',
    path: '/admin/mode', // default mode (public)
    element: {
      public: PublicModePage,
      admin: AdminModePage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: CoffeeIcon,
    color: 'blue',
  },
  {
    id: 'sound',
    path: '/admin/sound',
    element: {
      public: PublicSoundPage,
      admin: AdminSoundPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: VolumeIcon,
    color: 'crimson',
  },

  // AUTHENTICATED ENTRIES (only visible as admin) ========================== //
  {
    id: 'items',
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
    id: 'translations',
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
