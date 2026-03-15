import type { DialogConfig } from 'components/Dialog';
import { GenericDialog } from 'components/Dialog';
import { LanguageSelector } from 'components/LanguageSelector';

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageDialog = ({ isOpen, onClose }: LanguageDialogProps) => {
  const config: DialogConfig = {
    title: 'Language Settings',
    size: 'md',
    maxWidth: '600px',
    maxHeight: '80vh',
    minHeight: '800px',
    minWidth: '640px',
    tabs: [
      {
        id: 'language',
        label: 'Language Selection',
        content: <LanguageSelector />,
      },
    ],
    footer: {
      primaryButton: {
        label: 'OK',
        onClick: onClose,
        // variant: 'outline',
        colorScheme: 'default',
      },
    },
  };

  return <GenericDialog isOpen={true} onClose={onClose} config={config} />;
};
