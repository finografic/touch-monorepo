import type { ReactNode } from 'react';

import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import type { CreateSettersType } from 'utils/zustand';

import type { SessionKeys, SETTER_PREFIX } from './SessionContext';

export interface ConfigurationSession {
  id: string;
  flowType: FlowTypeValue;
  createdAt: string;
  filters: OrderFilters;
  slotNumbers: number[];
  isActive: boolean;
  isCurrent: boolean;
  isComplete: boolean;
}

export interface SessionValues {
  [SessionKeys.currentSessionId]: string | undefined;
  [SessionKeys.sessions]: Record<string, ConfigurationSession>;
}

type SessionSetters = CreateSettersType<SessionValues, typeof SETTER_PREFIX>;

type SessionActions = SessionSetters & {
  createSession: (flowType: FlowTypeValue, initialFilters?: OrderFilters) => string;
  setActiveSession: (sessionId: string) => void;
  updateSessionFilters: (sessionId: string, filters: OrderFilters) => void;
  assignOrdersToSession: (sessionId: string, slotNumbers: number[]) => void;
  completeSession: (sessionId: string) => void;
  clearSession: (sessionId: string) => void;
  clearAllSessions: () => void;
};

export interface SessionStore extends SessionValues {
  actions: SessionActions;
}

export interface SessionProviderProps {
  initialValue?: Partial<SessionValues>;
  children: ReactNode;
}
