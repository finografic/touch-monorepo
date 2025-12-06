import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import { FLOW_TYPES } from 'types/flow.types';
import type { ConfigurationSession, SessionStore, SessionValues } from './SessionContext.types';

export const DISPLAY_NAME = 'Session';
export const SETTER_PREFIX = '';

export enum SessionKeys {
  currentSessionId = 'currentSessionId',
  sessions = 'sessions',
}

export const defaultValue: SessionValues = {
  currentSessionId: undefined,
  sessions: {},
};

export const SessionContext = createZustandContext(({ initialValue }) => {
  return createStore<SessionStore>()(
    subscribeWithSelector(
      (set, get): SessionStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          createSession: (flowType: FlowTypeValue, initialFilters?: OrderFilters) => {
            const { sessions } = get();
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Only include filters for Product flows, not Time flows
            const sessionFilters = flowType === FLOW_TYPES.PROGRAM_PRODUCT ? initialFilters || {} : {};

            const newSession: ConfigurationSession = {
              id: sessionId,
              flowType,
              createdAt: new Date().toISOString(),
              filters: sessionFilters,
              slotNumbers: [],
              isActive: true,
              isCurrent: true,
              isComplete: false,
            };

            // Deactivate all other sessions
            const updatedSessions = Object.entries(sessions).reduce(
              (acc, [id, session]) => ({
                ...acc,
                [id]: { ...session, isActive: false, isCurrent: false },
              }),
              {} as Record<string, ConfigurationSession>,
            );

            set({
              sessions: {
                ...updatedSessions,
                [sessionId]: newSession,
              },
              currentSessionId: sessionId,
            });

            return sessionId;
          },
          setActiveSession: (sessionId: string) => {
            const { sessions } = get();

            if (!sessions[sessionId]) return;

            const updatedSessions = Object.entries(sessions).reduce(
              (acc, [id, session]) => ({
                ...acc,
                [id]: { ...session, isActive: id === sessionId },
              }),
              {} as Record<string, ConfigurationSession>,
            );

            set({
              sessions: updatedSessions,
              currentSessionId: sessionId,
            });
          },
          updateSessionFilters: (sessionId: string, filters: OrderFilters) => {
            const { sessions } = get();

            if (!sessions[sessionId]) return;

            set({
              sessions: {
                ...sessions,
                [sessionId]: {
                  ...sessions[sessionId],
                  filters,
                },
              },
            });
          },
          assignOrdersToSession: (sessionId: string, slotNumbers: number[]) => {
            const { sessions } = get();

            if (!sessions[sessionId]) return;

            set({
              sessions: {
                ...sessions,
                [sessionId]: {
                  ...sessions[sessionId],
                  slotNumbers: [...new Set([...sessions[sessionId].slotNumbers, ...slotNumbers])],
                },
              },
            });
          },
          completeSession: (sessionId: string) => {
            const { sessions } = get();

            if (!sessions[sessionId]) return;

            set({
              sessions: {
                ...sessions,
                [sessionId]: {
                  ...sessions[sessionId],
                  isActive: false,
                  isCurrent: false,
                  isComplete: true,
                },
              },
              currentSessionId: undefined,
            });
          },
          clearSession: (sessionId: string) => {
            const { sessions, currentSessionId } = get();
            const { [sessionId]: _removed, ...remainingSessions } = sessions;

            set({
              sessions: remainingSessions,
              currentSessionId: currentSessionId === sessionId ? undefined : currentSessionId,
            });
          },
          clearAllSessions: () => {
            set({
              sessions: {},
              currentSessionId: undefined,
            });
          },
        },
      }),
    ),
  );
});

type SessionReturn = Omit<SessionStore, 'actions'> & SessionStore['actions'];

export const useSession = (): SessionReturn => {
  const store = SessionContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<SessionStore>, SessionReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
