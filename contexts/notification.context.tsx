// contexts/notification.context.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import {Snackbar} from 'react-native-paper';
import {useThemeColors} from '@contexts/index';

type NotificationType = 'info' | 'success' | 'error';
type NotificationModalType = 'snackbar' | 'modal' | 'toast';

export interface NotificationOptions {
  message: string;
  type?: NotificationType;
  modalType?: NotificationModalType;
  duration?: number;
  actionLabel?: string;
  onActionPress?: () => void;
}

interface NotificationContextProps {
  showNotification: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  showNotification: () => {},
});

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {colors} = useThemeColors();
  const queueRef = useRef<NotificationOptions[]>([]);
  const [current, setCurrent] = useState<NotificationOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const getBackgroundColor = () => {
    switch (current?.type) {
      case 'success':
        return colors.button;
      case 'info':
        return colors.button;
      case 'error':
        return colors.error;
      default:
        return colors.transition;
    }
  };

  const showNotification = useCallback((options: NotificationOptions) => {
    queueRef.current.push(options);
    // Eğer şu anda bir snackbar gösterilmiyorsa göster:
    if (!visible && !current) {
      const next = queueRef.current.shift();
      console.log('next', next);
      if (next) {
        setCurrent(next);
      }
    }
  }, []);

  const onDismiss = () => {
    setVisible(false);
  };

  // Snackbar kapandıktan sonra sıradaki bildirimi göster
  useEffect(() => {
    if (!visible && queueRef.current.length > 0) {
      const next = queueRef.current.shift()!;
      console.log('next 2: ', next);
      setCurrent(next);
    } else if (!visible && queueRef.current.length === 0) {
      setCurrent(null);
    }
  }, [visible]);

  useEffect(() => {
    if (current && !visible) {
      console.log('visible: ', visible);
      setVisible(true);
    }
  }, [current]);
  console.log('current: ', current);
  return (
    <NotificationContext.Provider value={{showNotification}}>
      {children}

      {(current?.modalType === undefined ||
        current?.modalType === 'snackbar') &&
        current?.message && (
          <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            duration={current.duration ?? 3000}
            action={
              current.actionLabel
                ? {
                    label: current.actionLabel,
                    onPress: () => {
                      current.onActionPress?.();
                      onDismiss(); // action sonrası kapat
                    },
                  }
                : undefined
            }
            style={[{backgroundColor: getBackgroundColor()}]}>
            {current.message}
          </Snackbar>
        )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
