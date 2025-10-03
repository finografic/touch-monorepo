// Main exports for AuthProvider
export { AuthProvider, AuthProviderWithInitialization } from './AuthProvider';
export { useAuth } from './AuthContext';
export type { User, AuthSession, AuthProviderProps } from './AuthContext.types';

// Re-export everything for backward compatibility
export * from './AuthContext';
export * from './AuthContext.types';
