import { ReloadIcon } from 'styles/icons';

interface LoaderProps {
  message?: string;
  className?: string;
}

export const Loader = ({ message = 'Loading...', className = '' }: LoaderProps) => {
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}
    >
      <ReloadIcon style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
      <span>{message}</span>
    </div>
  );
};
