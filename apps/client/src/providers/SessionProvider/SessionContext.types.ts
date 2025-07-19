import type { ReactNode } from 'react';
import type { SessionKeys, SETTER_PREFIX } from './SessionContext';
import type { OrderFilters } from 'types/filters.types';

export interface ConfigurationSession {
  id: string;
  createdAt: string;
  filters: OrderFilters;
  orderNumbers: number[];
  isActive: boolean;
  isCurrent: boolean;
  isComplete: boolean;
}

export interface SessionValues {
  [SessionKeys.currentSessionId]: string | undefined;
  [SessionKeys.sessions]: Record<string, ConfigurationSession>;
}

type SessionSetters = {
  [K in keyof SessionValues as SessionValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: SessionValues[K]) => void;
};

type SessionActions = SessionSetters & {
  createSession: () => string;
  setActiveSession: (sessionId: string) => void;
  updateSessionFilters: (sessionId: string, filters: OrderFilters) => void;
  assignOrdersToSession: (sessionId: string, orderNumbers: number[]) => void;
  clearSession: (sessionId: string) => void;
  clearAllSessions: () => void;
};

export interface SessionProviderProps {
  initialValue?: Partial<SessionValues>;
  children: ReactNode;
}

export interface SessionStore extends SessionValues {
  actions: SessionActions;
}
