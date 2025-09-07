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
import { AppState, AppStateStatus } from 'react-native';
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
    notificationTime: '9:00',
    daysBeforeExpiry: 3,
  });
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize notification manager when user logs in
  useEffect(() => {
    if (user) {
      initializeNotifications();
    } else {
      // Don't clear notifications on auth glitches - only on intentional logout
      console.log(
        'Auth state changed - user is null, keeping notifications for now'
      );
      setHasPermissions(false);
    }
  }, [user]);

  // App state listener for permission detection
  useEffect(() => {
    // In your NotificationContext.tsx, update the app state handler:
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('=== APP STATE CHANGE ===');
      console.log('App state changed to:', nextAppState);

      if (nextAppState === 'active') {
        console.log('App became active - checking permissions...');
        recheckPermissions();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

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
      console.log('Error initializing notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recheckPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const granted = status === 'granted';

      // Only update if permission status changed
      if (granted !== hasPermissions) {
        console.log('Permission status changed:', {
          from: hasPermissions,
          to: granted,
        });
        setHasPermissions(granted);

        // Update preferences if permissions were granted
        if (granted) {
          await notificationManager.updatePreferences({ enabled: true });
          const updatedPrefs = await getPreferencesFromManager();
          setPreferences(updatedPrefs);
          console.log('Permissions granted - updated preferences');
        }
      }
    } catch (error) {
      console.log('Error rechecking permissions:', error);
    }
  };

  const getPreferencesFromManager =
    async (): Promise<NotificationPreferences> => {
      return await notificationManager.getPreferences();
    };
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await notificationManager.requestPermissions();
      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.log('Error requesting notification permissions:', error);
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
      console.log('Error updating notification preferences:', error);
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
