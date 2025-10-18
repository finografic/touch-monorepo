import type React from 'react';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
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
  UserShildIcon,
  ZapIcon,
} from 'styles/icons';

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
      public: null,
      user: AdminLanguagesBasicPage,
      admin: AdminLanguagesPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: LanguageIcon,
    color: 'green',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: null,
      // user: AdminSoundBasicPage,
      user: AdminSoundBasicPage,
      admin: AdminSoundBasicPage,
      // admin: AdminSoundPage,
    },
    hasNav: { public: false, user: true, admin: true },
    hasCard: { public: false, user: true, admin: true },
    icon: SpeakerLoudIcon,
    color: 'indigo',
  },
  {
    key: 'mode',
    path: '/admin/mode',
    element: {
      public: null,
      user: AdminSoundBasicPage,
      admin: null,
    },
    hasNav: { public: false, user: true, admin: false },
    hasCard: { public: false, user: true, admin: false },
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
      user: null,
      admin: AdminOrdersPage,
    },
    hasNav: { public: false, user: false, admin: true },
    hasCard: { public: false, user: false, admin: true },
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
