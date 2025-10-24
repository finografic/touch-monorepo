import type React from 'react';
import { Outlet } from 'react-router-dom';

import { AdminLanguagesPage, PublicLanguagesPage } from 'admin/pages/AdminLanguagesPage';
import { PublicModePage } from 'admin/pages/AdminModePage';
import { AdminOrdersPage } from 'admin/pages/AdminOrdersPage/AdminOrdersPage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage, PublicSoundPage } from 'admin/pages/AdminSoundPage';
import { AdminTranslationsPage } from 'admin/pages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminUiLabelsPage } from 'admin/pages/AdminUiLabelsPage';
import NotFoundPage from 'pages/NotFound';

import {
  CoffeeIcon,
  EditIcon,
  LanguageIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SettingsIcon,
  SpeakerLoudIcon,
  UserShildIcon,
  VolumeIcon,
  ZapIcon,
} from 'styles/icons';

export type AuthRoles = 'public' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  key: string;
  path: string;
  element: Record<AuthRoles, React.ComponentType | null>;
}

/** Main admin route entry interface - composed of base + optional consumer-specific properties */
export interface AdminRouteEntry extends AdminRouteBase {
  hasNav?: Record<AuthRoles, boolean>;
  hasCard?: Record<AuthRoles, boolean>;
  icon?: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
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
    hasNav: { public: false, admin: false }, // no nav
    hasCard: { public: false, admin: false }, // no card
    // icon: null,
    // color: 'blue',
  },
  // PUBLIC ENTRIES (accessible without login) ============================== //
  {
    key: 'mode',
    path: '/admin/mode', // default mode (public)
    element: {
      public: PublicModePage,
      admin: null,
    },
    hasNav: { public: true, admin: false },
    hasCard: { public: true, admin: false },
    // icon: UserShildIcon,
    icon: CoffeeIcon,
    color: 'blue',
  },
  {
    key: 'languages',
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
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: PublicSoundPage,
      admin: AdminSoundPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    // icon: SpeakerLoudIcon,
    icon: VolumeIcon,
    color: 'crimson',
  },
  {
    key: 'maintenance',
    path: '/admin/maintenance', // relays (public)
    element: {
      public: NotFoundPage,
      admin: null,
    },
    hasNav: { public: true, admin: false },
    hasCard: { public: true, admin: false },
    icon: SettingsIcon,
    // color: 'orange',
    color: 'orange',
  },
  // AUTHENTICATED ENTRIES (only visible as admin) ========================== //
  {
    key: 'items',
    path: '/admin/items', // orders
    element: {
      public: null,
      admin: AdminOrdersPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    // icon: UserShildIcon,
    icon: ListIcon,
    color: 'blue',
  },
  {
    key: 'translations',
    path: '/admin/translations',
    element: {
      public: null,
      admin: AdminTranslationsPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: EditIcon,
    color: 'blue',
  },
  {
    key: 'uiLabels',
    path: '/admin/ui-labels',
    element: {
      public: AdminUiLabelsPage,
      admin: AdminUiLabelsPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: EditIcon,
    color: 'purple',
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
    icon: UserShildIcon,
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
    color: 'purple',
  },
];
