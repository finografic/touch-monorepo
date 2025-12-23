// NOTE: ICON DEFINITIONS - Radix + Lucide with auto-className
// ref + search: https://lucide.dev/icons/

import {
  // ChevronDownIcon as _ChevronDownIcon,
  CountdownTimerIcon as _CountdownTimerIcon,
  Cross2Icon as _Cross2Icon,
  DoubleArrowLeftIcon as _DoubleArrowLeftIcon,
  DoubleArrowRightIcon as _DoubleArrowRightIcon,
  ExclamationTriangleIcon as _ExclamationTriangleIcon,
  HamburgerMenuIcon as _HamburgerMenuIcon,
  InfoCircledIcon as _InfoCircledIcon,
  PlusIcon as _PlusIcon,
  ReloadIcon as _ReloadIcon,
  SpeakerLoudIcon as _SpeakerLoudIcon,
  StarIcon as _StarIcon,
  TextAlignLeftIcon as _TextAlignLeftIcon,
  TextAlignTopIcon as _TextAlignTopIcon,
  TimerIcon as _TimerIcon,
  TrashIcon as _TrashIcon,
} from '@radix-ui/react-icons';
import {
  AppWindowMac as _AppWindowMacIcon,
  AppWindowMac as _WindowIcon,
  BadgeCheck as _BadgeCheckIcon,
  CheckCircle2 as _CheckCircle2Icon,
  ChevronDownIcon as _ChevronDownIcon,
  ChevronLeftIcon as _ChevronLeftIcon,
  ChevronRightIcon as _ChevronRightIcon,
  ChevronUpIcon as _ChevronUpIcon,
  CircleStop as _StopIcon,
  CircleUserRound as _CircleUserRoundIcon,
  Clipboard as _ClipboardIcon,
  Coffee as _CoffeeIcon,
  Cog as _SettingsIcon,
  Columns3 as _Columns3Icon,
  Columns4 as _Columns4Icon,
  Eye as _EyeIcon,
  EyeOff as _EyeOffIcon,
  FastForward as _FastForwardIcon,
  Grid3x2Icon as _Grid3x2Icon,
  House as _HomeIcon,
  Languages as _LanguagesIcon,
  List as _ListIcon,
  ListChecks as _ListChecksIcon,
  Lock as _LockIcon,
  Moon as _MoonIcon,
  PanelBottomClose as _PanelBottomCloseIcon,
  PanelBottomOpen as _PanelBottomOpenIcon,
  PanelLeftClose as _PanelLeftCloseIcon,
  PanelLeftOpen as _PanelLeftOpenIcon,
  PencilLine as _EditIcon,
  Radio as _RadioIcon,
  RefreshCcwIcon as _RefreshCcwIcon,
  Search as _MagnifyingGlassIcon,
  ShieldCheck as _ShieldCheckIcon,
  ShieldUser as _ShieldUserIcon,
  Sun as _SunIcon,
  Thermometer as _TempIcon,
  TimerReset as _TimerResetIcon,
  Trash2 as _Trash2Icon,
  User as _UserIcon,
  UserLock as _UserLockIcon,
  UserRoundCheck as _UserRoundCheckIcon,
  Volume2Icon as _Volume2Icon,
  Wine as _WineIcon,
  X as _DeleteIcon,
  Zap as _ZapIcon,
} from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ============================================================================
// ICON EXPORTS - Enhanced with auto-className
// ============================================================================

// Core Radix Icons - with semantic export names
export const CountdownTimerIcon = createIconWrapper(_CountdownTimerIcon, 'CountdownTimerIcon');
export const Cross2Icon = createIconWrapper(_Cross2Icon, 'Cross2Icon');
export const DialogIcon = createIconWrapper(_AppWindowMacIcon, 'DialogIcon');
export const ExclamationTriangleIcon = createIconWrapper(_ExclamationTriangleIcon, 'ExclamationTriangleIcon');
export const ReloadIcon = createIconWrapper(_ReloadIcon, 'ReloadIcon');
export const ShieldCheckIcon = createIconWrapper(_ShieldCheckIcon, 'ShieldCheckIcon');
export const StarIcon = createIconWrapper(_StarIcon, 'StarIcon');
export const TextAlignLeftIcon = createIconWrapper(_TextAlignLeftIcon, 'TextAlignLeftIcon');
export const TextAlignTopIcon = createIconWrapper(_TextAlignTopIcon, 'TextAlignTopIcon');
export const TimerIcon = createIconWrapper(_TimerIcon, 'TimerIcon');

// Navigation & Buttons
export const DoubleArrowLeftIcon = createIconWrapper(_DoubleArrowLeftIcon, 'DoubleArrowLeftIcon');
export const DoubleArrowRightIcon = createIconWrapper(_DoubleArrowRightIcon, 'DoubleArrowRightIcon');

// Common Aliases - these get semantic names, not original names
export const CloseIcon = createIconWrapper(_Cross2Icon, 'CloseIcon');
export const DropdownIcon = createIconWrapper(_ChevronDownIcon, 'DropdownIcon');
export const MenuIcon = createIconWrapper(_HamburgerMenuIcon, 'MenuIcon');

// Lucide Icons - UI Elements
export const CoffeeIcon = createIconWrapper(_CoffeeIcon, 'CoffeeIcon');
export const LanguageIcon = createIconWrapper(_LanguagesIcon, 'LanguageIcon');
export const MoonIcon = createIconWrapper(_MoonIcon, 'MoonIcon');
export const SunIcon = createIconWrapper(_SunIcon, 'SunIcon');
export const TempIcon = createIconWrapper(_TempIcon, 'TempIcon');
export const WindowIcon = createIconWrapper(_WindowIcon, 'WindowIcon');
export const WineIcon = createIconWrapper(_WineIcon, 'WineIcon');

// Admin & Actions
export const AddIcon = createIconWrapper(_PlusIcon);
export const BadgeCheckIcon = createIconWrapper(_BadgeCheckIcon);
export const CheckCircleIcon = createIconWrapper(_CheckCircle2Icon);
export const ChevronLeftIcon = createIconWrapper(_ChevronLeftIcon);
export const ChevronRightIcon = createIconWrapper(_ChevronRightIcon);
export const ChevronUpIcon = createIconWrapper(_ChevronUpIcon);
export const ChevronDownIcon = createIconWrapper(_ChevronDownIcon);
export const ClipboardIcon = createIconWrapper(_ClipboardIcon);
export const DeleteIcon = createIconWrapper(_DeleteIcon);
export const EditIcon = createIconWrapper(_EditIcon);
export const FastForwardIcon = createIconWrapper(_FastForwardIcon);
export const GridIcon = createIconWrapper(_Grid3x2Icon);
export const HomeIcon = createIconWrapper(_HomeIcon);
export const InfoCircledIcon = createIconWrapper(_InfoCircledIcon);
export const ListIcon = createIconWrapper(_ListIcon);
export const ListChecksIcon = createIconWrapper(_ListChecksIcon);
export const LockIcon = createIconWrapper(_LockIcon);
export const MagnifyingGlassIcon = createIconWrapper(_MagnifyingGlassIcon);
export const PanelBottomCloseIcon = createIconWrapper(_PanelBottomCloseIcon);
export const PanelBottomOpenIcon = createIconWrapper(_PanelBottomOpenIcon);
export const PanelLeftCloseIcon = createIconWrapper(_PanelLeftCloseIcon);
export const PanelLeftOpenIcon = createIconWrapper(_PanelLeftOpenIcon);
export const EyeIcon = createIconWrapper(_EyeIcon);
export const EyeOffIcon = createIconWrapper(_EyeOffIcon);
export const Columns3Icon = createIconWrapper(_Columns3Icon);
export const Columns4Icon = createIconWrapper(_Columns4Icon);
export const PlusIcon = createIconWrapper(_PlusIcon);
export const RadioIcon = createIconWrapper(_RadioIcon);
export const RefreshIcon = createIconWrapper(_RefreshCcwIcon);
export const SettingsIcon = createIconWrapper(_SettingsIcon);
export const SpeakerLoudIcon = createIconWrapper(_SpeakerLoudIcon);
export const StopIcon = createIconWrapper(_StopIcon);
export const TimerResetIcon = createIconWrapper(_TimerResetIcon);
export const TrashIcon = createIconWrapper(_Trash2Icon);
export const UserCircleIcon = createIconWrapper(_CircleUserRoundIcon);
export const UserIcon = createIconWrapper(_UserIcon);
export const UserLockIcon = createIconWrapper(_UserLockIcon);
export const UserRoundCheckIcon = createIconWrapper(_UserRoundCheckIcon);
export const UserShildIcon = createIconWrapper(_ShieldUserIcon);
export const VolumeIcon = createIconWrapper(_Volume2Icon);
export const ZapIcon = createIconWrapper(_ZapIcon);

// ============================================================================
// AUTOMATIC ICON MAP & TYPES
// ============================================================================

/**
 * Automatic icon map - no manual maintenance required!
 * This creates a map of icon names to their components automatically
 */
export const ICON_MAP = {
  AddIcon,
  BadgeCheckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CloseIcon,
  CoffeeIcon,
  Columns3Icon,
  Columns4Icon,
  CountdownTimerIcon,
  Cross2Icon,
  DeleteIcon,
  DialogIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DropdownIcon,
  EditIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeOffIcon,
  FastForwardIcon,
  GridIcon,
  HomeIcon,
  InfoCircledIcon,
  LanguageIcon,
  ListIcon,
  ListChecksIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MenuIcon,
  MoonIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
  RadioIcon,
  RefreshIcon,
  ReloadIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SpeakerLoudIcon,
  StarIcon,
  StopIcon,
  SunIcon,
  TempIcon,
  TextAlignLeftIcon,
  TextAlignTopIcon,
  TimerIcon,
  TimerResetIcon,
  TrashIcon,
  UserCircleIcon,
  UserIcon,
  UserLockIcon,
  UserRoundCheckIcon,
  UserShildIcon,
  VolumeIcon,
  WindowIcon,
  WineIcon,
  ZapIcon,
} as const;

/**
 * Icon name type - automatically generated from ICON_MAP keys
 */
export type IconName = keyof typeof ICON_MAP;

/**
 * Icon component type - automatically generated from ICON_MAP values
 */
export type IconType = (typeof ICON_MAP)[IconName];

/**
 * Helper function to get an icon by name
 * Useful for dynamic icon rendering
 */
export function getIconByName(iconName: IconName): IconType {
  return ICON_MAP[iconName];
}

/**
 * Helper function to check if a string is a valid icon name
 */
export function isValidIconName(name: string): name is IconName {
  return name in ICON_MAP;
}

/**
 * Get all available icon names
 */
export function getAvailableIconNames(): IconName[] {
  return Object.keys(ICON_MAP) as IconName[];
}
