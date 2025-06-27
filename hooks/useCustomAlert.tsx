import CustomAlert from '@/components/CustomAlert';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { AlertButton } from 'react-native';

type AlertOptions = {
  title: string;
  message: string;
  icon?: string;
  buttons?: AlertButton[];
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOptions(null), 350); // Let the dialog fade out
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        visible={visible}
        onDismiss={handleDismiss}
        title={options?.title || ''}
        message={options?.message || ''}
        icon={options?.icon}
        buttons={options?.buttons
          ?.filter(
            (b): b is AlertButton & { text: string } =>
              typeof b.text === 'string'
          )
          .map((b) => ({ ...b, text: b.text as string }))}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
}
