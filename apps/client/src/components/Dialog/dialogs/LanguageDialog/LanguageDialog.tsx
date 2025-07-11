import { type DialogConfig, GenericDialog } from 'components/Dialog';
import { LanguageSelector } from 'components/LanguageSelector';

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageDialog = ({ isOpen, onClose }: LanguageDialogProps) => {
  const config: DialogConfig = {
    title: 'Language Settings',
    size: '3',
    maxWidth: '600px',
    maxHeight: '80vh',
    minHeight: '800px',
    minWidth: '640px',
    theme: {
      appearance: 'dark',
      accentColor: 'blue',
      grayColor: 'sand',
      scaling: '110%',
    },
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
        variant: 'soft',
        color: 'blue',
      },
    },
  };

  return <GenericDialog isOpen={isOpen} onClose={onClose} config={config} />;
};
