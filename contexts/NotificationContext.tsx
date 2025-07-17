import {
  notificationManager,
  NotificationPreferences,
} from '@/services/notificationManager';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  preferences: NotificationPreferences;
  updatePreferences: (
    preferences: Partial<NotificationPreferences>
  ) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    notificationTime: '17:54',
    daysBeforeExpiry: 3,
  });
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize notification manager when user logs in
  useEffect(() => {
    if (user) {
      initializeNotifications();
    } else {
      // Clear notifications when user logs out
      notificationManager.clearAllNotifications();
      setHasPermissions(false);
    }
  }, [user]);

  // Set up notification listeners
  useEffect(() => {
    // Handle notification tap (when app is opened from notification)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);

        const { type, productId } =
          response.notification.request.content.data || {};

        if (type === 'expiry_alert') {
          // Navigate to inventory screen when notification is tapped
          router.push('/(tabs)/inventory');
        }
      });

    // Handle notification received (when app is in foreground)
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received in foreground:', notification);
        //  Show an in-app banner here
      }
    );

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, [router]);

  const initializeNotifications = async () => {
    try {
      setIsLoading(true);

      const initialized = await notificationManager.initialize();
      setHasPermissions(initialized);

      const userPreferences = await getPreferencesFromManager();
      setPreferences(userPreferences);

      console.log('Notifications initialized:', initialized);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPreferencesFromManager =
    async (): Promise<NotificationPreferences> => {
      // Access the private method through a public interface
      try {
        const { status } = await Notifications.getPermissionsAsync();
        const enabled = status === 'granted';

        // For now, return defaults
        return {
          enabled,
          notificationTime: '17:54',
          daysBeforeExpiry: 3,
        };
      } catch (error) {
        console.error('Error getting preferences:', error);
        return {
          enabled: true,
          notificationTime: '17:55',
          daysBeforeExpiry: 3,
        };
      }
    };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await notificationManager.requestPermissions();
      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const updatePreferences = async (
    newPreferences: Partial<NotificationPreferences>
  ) => {
    try {
      await notificationManager.updatePreferences(newPreferences);
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);

      console.log('Notification preferences updated:', updated);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  const value: NotificationContextType = {
    preferences,
    updatePreferences,
    requestPermissions,
    hasPermissions,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}

export default NotificationProvider;
