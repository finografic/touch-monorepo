import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { ConfigurationSession, SessionStore, SessionValues } from './SessionContext.types';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import { subscribeWithSelector } from 'zustand/middleware';

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
          createSession: (flowType: FlowTypeValue) => {
            const { sessions } = get();
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const newSession: ConfigurationSession = {
              id: sessionId,
              flowType,
              createdAt: new Date().toISOString(),
              filters: {},
              orderNumbers: [],
              isActive: true,
              isCurrent: true,
              isComplete: false,
            };

            log('__DEV: NEW_SESSION', 'lime', newSession);

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
          assignOrdersToSession: (sessionId: string, orderNumbers: number[]) => {
            const { sessions } = get();

            if (!sessions[sessionId]) return;

            set({
              sessions: {
                ...sessions,
                [sessionId]: {
                  ...sessions[sessionId],
                  orderNumbers: [...new Set([...sessions[sessionId].orderNumbers, ...orderNumbers])],
                },
              },
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
