import type React from 'react';
import { AdminLanguagesPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminSoundPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundPage';
import { AdminSoundBasicPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundBasicPage';
import { AdminTranslationsPage } from 'pages/AdminPages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminUiLabelsPage } from 'pages/AdminPages/AdminUiLabelsPage';
import { AdminOrdersPage } from 'pages/AdminPages/AdminOrdersPage/AdminOrdersPage';
import { AdminFilterAnalysisPage } from 'pages/AdminPages/AdminFilterAnalysisPage';
import { AdminSlotsConfigPage } from 'pages/AdminPages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminModePage } from 'pages/AdminPages/AdminModePage/AdminModePage';
import { AdminModeBasicPage } from 'pages/AdminPages/AdminModePage/AdminModeBasicPage';
import {
  EditIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  SettingsIcon,
  UserShildIcon,
  ZapIcon,
} from 'styles/icons';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { AdminLanguagesBasicPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesBasicPage';
import { AdminRelaysPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysPage';
import { AdminRelaysBasicPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysBasicPage';

export type AuthRoles = 'public' | 'user' | 'admin';

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
  // PUBLIC ENTRIES (visible to everyone)
  {
    key: 'languages',
    path: '/admin/languages',
    element: {
      public: AdminLanguagesBasicPage,
      user: AdminLanguagesPage,
      admin: AdminLanguagesPage,
    },
    hasNav: { public: true, user: true, admin: true },
    hasCard: { public: true, user: true, admin: true },
    icon: LanguageIcon,
    color: 'green',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: AdminSoundBasicPage,
      user: AdminSoundPage,
      admin: AdminSoundPage,
    },
    hasNav: { public: true, user: true, admin: true },
    hasCard: { public: true, user: true, admin: true },
    icon: SpeakerLoudIcon,
    color: 'indigo',
  },
  {
    key: 'mode',
    path: '/admin/mode',
    element: {
      public: AdminModeBasicPage,
      user: null,
      admin: null,
    },
    hasNav: { public: true, user: false, admin: false },
    hasCard: { public: true, user: false, admin: false },
    icon: UserShildIcon,
    color: 'blue',
  },

  // AUTHENTICATED ENTRIES (only visible when logged in)
  {
    key: 'translations',
    path: '/admin/translations',
    element: {
      public: null,
      user: AdminTranslationsPage,
      admin: AdminTranslationsPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: EditIcon,
    color: 'blue',
  },
  {
    key: 'uiLabels',
    path: '/admin/ui-labels',
    element: {
      public: null,
      user: AdminUiLabelsPage,
      admin: AdminUiLabelsPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: EditIcon,
    color: 'purple',
  },
  {
    key: 'maintenance',
    path: '/admin/maintenance',
    element: {
      public: AdminSlotsConfigPage,
      user: null,
      admin: null,
    },
    hasNav: { public: true, user: false, admin: false },
    hasCard: { public: true, user: false, admin: false },
    icon: SettingsIcon,
    color: 'orange',
  },
  {
    key: 'slotConfig',
    path: '/admin/slot-config',
    element: {
      public: null,
      user: AdminSlotsConfigPage,
      admin: AdminSlotsConfigPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: UserShildIcon,
    color: 'orange',
  },

  {
    key: 'filterAnalysis',
    path: '/admin/filter-analysis',
    element: {
      public: null,
      user: AdminFilterAnalysisPage,
      admin: AdminFilterAnalysisPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: MagnifyingGlassIcon,
    color: 'blue',
  },
  {
    key: 'orders',
    path: '/admin/orders',
    element: {
      public: null,
      user: AdminOrdersPage,
      admin: AdminOrdersPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: UserShildIcon,
    color: 'blue',
  },
  {
    key: 'relays',
    path: '/admin/relays',
    element: {
      public: null,
      user: AdminRelaysPage,
      admin: AdminRelaysPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: ZapIcon,
    color: 'purple',
  },
];
