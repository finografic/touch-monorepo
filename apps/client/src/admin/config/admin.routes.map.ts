import type React from 'react';
import { Outlet } from 'react-router-dom';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';
import {
  CoffeeIcon,
  EditIcon,
  GridIcon,
  LanguageIcon,
  ListIcon,
  VolumeIcon,
  ZapIcon,
} from '@finografic/icons';
import type { AuthRoles } from '@workspace/shared/auth';

import { AdminLanguagesPage, PublicLanguagesPage } from 'admin/pages/AdminLanguagesPage';
import { AdminModePage } from 'admin/pages/AdminModePage/AdminModePage';
import { PublicModePage } from 'admin/pages/AdminModePage/PublicModePage';
import { AdminRelaysPage } from 'admin/pages/AdminRelaysPage/AdminRelaysPage';
import { PublicRelaysPage } from 'admin/pages/AdminRelaysPage/PublicRelaysPage';
import { AdminSlotsConfigPage } from 'admin/pages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import { AdminSoundPage, PublicSoundPage } from 'admin/pages/AdminSoundPage';
import { TranslationsPage } from 'admin/pages/Translations/TranslationsPage';
import { TranslationsProductPage } from 'admin/pages/Translations/TranslationsProductPage';
import { AdminImagesPage } from 'admin/pages/AdminImagesPage/AdminImagesPage';
import { PublicImagesPage } from 'admin/pages/AdminImagesPage/PublicImagesPage';
import { ImagesIcon } from 'lucide-react';

export type { AuthRoles };

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
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | string;
  children?: AdminRouteConfig[]; // Sub-routes for nested routes (e.g., items/new, items/:id)
}

/**
 * Translation domains where the `pages` group is split into separate
 * "Páginas (admin)" / "Páginas (public)" role tabs.
 * All other domains render `pages` as a single unsplit section.
 */
export const TRANSLATION_DOMAINS_WITH_ROLE_SPLIT: readonly I18nTranslationsDomain[] = ['admin'];

/** Single source of truth for admin shell: nav, cards, and (via `getAdminPageSegmentsNavOrder`) `admin.pages.*` i18n segment order. */
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
  // ======================================================================== //
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
    color: 'primary',
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
    color: 'warning',
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
    color: 'success',
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
    color: 'primary',
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
    color: 'danger',
  },

  {
    id: 'images',
    path: '/admin/images',
    element: {
      public: PublicImagesPage,
      admin: AdminImagesPage,
    },
    hasNav: { public: true, admin: true },
    hasCard: { public: true, admin: true },
    icon: ImagesIcon,
    color: 'primary',
  },

  // AUTHENTICATED ENTRIES (only visible as admin) ========================== //
  {
    id: 'translations_product',
    path: '/admin/translations-product',
    element: {
      public: null,
      admin: TranslationsProductPage,
    },
    hasNav: { public: false, admin: true },
    hasCard: { public: false, admin: true },
    icon: EditIcon,
    color: 'secondary',
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
    color: 'secondary',
    children: [
      {
        id: 'translations_ui',
        path: '/admin/translations/ui',
        element: {
          public: null,
          admin: TranslationsPage,
        },
      },
      {
        id: 'translations_app',
        path: '/admin/translations/app',
        element: {
          public: null,
          admin: TranslationsPage,
        },
      },
      {
        id: 'translations_admin',
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
    color: 'success',
  },
];
