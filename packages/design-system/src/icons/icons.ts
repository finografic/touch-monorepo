/**
 * Icon Registry — @workspace/design-system
 *
 * Single source of truth for all registered icons.
 * To add a new icon: add ONE entry to the ICONS object below.
 * The icon is automatically wrapped and available via `icons.YourIconName`.
 *
 * Browse all available Lucide icons: https://lucide.dev/icons/
 *
 * Usage:
 *   import { icons } from '@workspace/design-system/icons';
 *   const { AddIcon, CloseIcon } = icons;
 *
 *   // Types:
 *   import type { IconName, IconComponent } from '@workspace/design-system/icons';
 */

import * as Lucide from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ── Icon registry ──────────────────────────────────────────────────────────────
// Add a new icon HERE — that's the only place you need to touch.
// Aliases (multiple names → same Lucide icon) are fully supported.

const ICONS = {
  // ── Core UI ─────────────────────────────────────────────────────────────────
  AddIcon:                  Lucide.Plus,
  BadgeCheckIcon:           Lucide.BadgeCheck,
  CheckCircleIcon:          Lucide.CheckCircle2,
  ClipboardIcon:            Lucide.Clipboard,
  CloseIcon:                Lucide.X,
  CoffeeIcon:               Lucide.Coffee,
  Columns3Icon:             Lucide.Columns3,
  Columns4Icon:             Lucide.Columns4,
  CountdownTimerIcon:       Lucide.Hourglass,
  Cross2Icon:               Lucide.X,
  DeleteIcon:               Lucide.X,
  DialogIcon:               Lucide.AppWindowMac,
  DropdownIcon:             Lucide.ChevronDown,
  EditIcon:                 Lucide.PencilLine,
  ExclamationTriangleIcon:  Lucide.TriangleAlert,
  EyeOffIcon:               Lucide.EyeOff,
  EyeOnIcon:                Lucide.Eye,
  FastForwardIcon:          Lucide.FastForward,
  FullscreenIcon:           Lucide.Fullscreen,
  GridIcon:                 Lucide.Grid3x3,
  HomeIcon:                 Lucide.House,
  InfoCircledIcon:          Lucide.Info,
  LanguageIcon:             Lucide.Languages,
  ListChecksIcon:           Lucide.ListChecks,
  ListIcon:                 Lucide.List,
  LockIcon:                 Lucide.Lock,
  MagnifyingGlassIcon:      Lucide.Search,
  MenuIcon:                 Lucide.Menu,
  MinimizeIcon:             Lucide.Minimize,
  MinusIcon:                Lucide.Minus,
  MoonIcon:                 Lucide.Moon,
  PlusIcon:                 Lucide.Plus,
  RadioIcon:                Lucide.Radio,
  RefreshIcon:              Lucide.RefreshCcw,
  ReloadIcon:               Lucide.RotateCw,
  SettingsIcon:             Lucide.Cog,
  ShieldCheckIcon:          Lucide.ShieldCheck,
  ShuffleIcon:              Lucide.Shuffle,
  SpeakerLoudIcon:          Lucide.Volume2,
  StarIcon:                 Lucide.Star,
  StopIcon:                 Lucide.CircleStop,
  SunIcon:                  Lucide.Sun,
  TempIcon:                 Lucide.Thermometer,
  TextAlignLeftIcon:        Lucide.AlignLeft,
  TextAlignTopIcon:         Lucide.AlignStartVertical,
  TimerIcon:                Lucide.Timer,
  TimerResetIcon:           Lucide.TimerReset,
  TrashIcon:                Lucide.Trash2,
  UploadIcon:               Lucide.Upload,
  UserCircleIcon:           Lucide.CircleUserRound,
  UserIcon:                 Lucide.User,
  UserLockIcon:             Lucide.UserLock,
  UserRoundCheckIcon:       Lucide.UserRoundCheck,
  UserShieldIcon:           Lucide.ShieldUser,
  VolumeIcon:               Lucide.Volume2,
  VolumeOffIcon:            Lucide.VolumeOff,
  WindowIcon:               Lucide.AppWindowMac,
  WineIcon:                 Lucide.Wine,
  ZapIcon:                  Lucide.Zap,

  // ── Navigation — Chevrons ────────────────────────────────────────────────────
  ChevronDownIcon:          Lucide.ChevronDown,
  ChevronLeftIcon:          Lucide.ChevronLeft,
  ChevronRightIcon:         Lucide.ChevronRight,
  ChevronUpIcon:            Lucide.ChevronUp,
  DoubleArrowLeftIcon:      Lucide.ChevronsLeft,
  DoubleArrowRightIcon:     Lucide.ChevronsRight,

  // ── Panels ───────────────────────────────────────────────────────────────────
  PanelBottomCloseIcon:     Lucide.PanelBottomClose,
  PanelBottomOpenIcon:      Lucide.PanelBottomOpen,
  PanelLeftCloseIcon:       Lucide.PanelLeftClose,
  PanelLeftOpenIcon:        Lucide.PanelLeftOpen,
} as const;

// ── Auto-wrap ──────────────────────────────────────────────────────────────────

type WrappedIconMap = { [K in keyof typeof ICONS]: ReturnType<typeof createIconWrapper> };

const wrappedIcons = Object.fromEntries(
  Object.entries(ICONS).map(([name, icon]) => [name, createIconWrapper(icon, name)]),
) as WrappedIconMap;

// ── Public API ─────────────────────────────────────────────────────────────────

/** All registered icons as a strongly-typed object. Destructure at the call site. */
export const icons = wrappedIcons;

/** Union of all registered icon export names. */
export type IconName = keyof typeof ICONS;

/** Sorted list of all registered icon names (useful for pickers / docs). */
export const ICON_NAMES = (Object.keys(ICONS) as IconName[]).sort();

/** Type of any wrapped icon component returned by `createIconWrapper`. */
export type IconComponent = ReturnType<typeof createIconWrapper>;
