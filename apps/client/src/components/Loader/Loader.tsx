import { Spinner } from '@finografic/design-system/components';

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
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Spinner size={20} />
      <span>{message}</span>
    </div>
  );
};
