import type React from 'react';
import { Outlet } from 'react-router-dom';

import { AdminDashboardPage } from 'admin/AdminDashboardPage';
import { AdminFilterAnalysisPage } from 'admin/pages/AdminFilterAnalysisPage';
import { AdminLanguagesBasicPage } from 'admin/pages/AdminLanguagesPage/AdminLanguagesBasicPage';
import { AdminLanguagesPage } from 'admin/pages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminModeBasicPage } from 'admin/pages/AdminModePage/AdminModeBasicPage';
import { AdminModePage } from 'admin/pages/AdminModePage/AdminModePage';
import { AdminOrdersPage } from 'admin/pages/AdminOrdersPage/AdminOrdersPage';
import { AdminRelaysBasicPage } from 'admin/pages/AdminRelaysPage/AdminRelaysBasicPage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundBasicPage } from 'admin/pages/AdminSoundPage/AdminSoundBasicPage';
import { AdminSoundPage } from 'admin/pages/AdminSoundPage/AdminSoundPage';
import { AdminTranslationsPage } from 'admin/pages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminUiLabelsPage } from 'admin/pages/AdminUiLabelsPage';

import {
  EditIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  SettingsIcon,
  SpeakerLoudIcon,
  UserShildIcon,
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
  // DASHBOARD (accessible to all - index route)
  {
    key: 'dashboard',
    path: '/admin',
    element: {
      public: Outlet,
      admin: Outlet,
    },
    hasNav: { public: false, admin: false }, // Dashboard doesn't show in nav (it's the home)
    hasCard: { public: false, admin: false }, // Dashboard doesn't show as a card
    icon: LanguageIcon, // Not used, but required by type
    color: 'blue',
  },

  // PUBLIC ENTRIES (accessible without login)
  // TODO: LEAVE THIS IN !!
  // {
  //   key: 'languages',
  //   path: '/admin/languages',
  //   element: {
  //     public: AdminLanguagesBasicPage,
  //     admin: AdminLanguagesPage,
  //   },
  //   hasNav: { public: true, admin: true },
  //   hasCard: { public: true, admin: true },
  //   icon: LanguageIcon,
  //   color: 'green',
  // },
  // TOOD: DEV VERSION ONLY...
  {
    key: 'languages',
    path: '/admin/languages',
    element: {
      public: null,
      admin: AdminLanguagesPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: LanguageIcon,
    color: 'green',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: AdminSoundBasicPage,
      admin: AdminSoundBasicPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: SpeakerLoudIcon,
    color: 'indigo',
  },
  {
    key: 'mode',
    path: '/admin/mode',
    element: {
      public: AdminModeBasicPage,
      admin: null,
    },
    hasNav: { public: true, admin: false },
    hasCard: { public: true, admin: false },
    icon: UserShildIcon,
    color: 'blue',
  },
  {
    key: 'translations',
    path: '/admin/translations',
    element: {
      public: AdminTranslationsPage,
      admin: AdminTranslationsPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
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
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: EditIcon,
    color: 'purple',
  },
  {
    key: 'maintenance',
    path: '/admin/maintenance',
    element: {
      public: AdminSlotsConfigPage,
      admin: null,
    },
    hasNav: { public: true, admin: false },
    hasCard: { public: true, admin: false },
    icon: SettingsIcon,
    color: 'orange',
  },
  {
    key: 'slotConfig',
    path: '/admin/slot-config',
    element: {
      public: AdminSlotsConfigPage,
      admin: AdminSlotsConfigPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: UserShildIcon,
    color: 'orange',
  },
  {
    key: 'filterAnalysis',
    path: '/admin/filter-analysis',
    element: {
      public: AdminFilterAnalysisPage,
      admin: AdminFilterAnalysisPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: MagnifyingGlassIcon,
    color: 'blue',
  },
  {
    key: 'relays',
    path: '/admin/relays',
    element: {
      public: AdminRelaysBasicPage,
      admin: AdminRelaysPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: ZapIcon,
    color: 'purple',
  },

  // ADMIN-ONLY ENTRIES (require admin login)
  {
    key: 'orders',
    path: '/admin/orders',
    element: {
      public: null,
      admin: AdminOrdersPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: UserShildIcon,
    color: 'blue',
  },
];
