import { ReloadIcon } from '@radix-ui/react-icons';

interface LoaderProps {
  message?: string;
  className?: string;
}

export const Loader = ({ message = 'Loading...', className = '' }: LoaderProps) => {
  return (
    <div className={`flex items-center gap-2 text-blue-500 ${className}`} role="status" aria-live="polite">
      <ReloadIcon className="h-5 w-5 animate-spin" />
      <span>{message}</span>
    </div>
  );
};
