import { notificationManager } from '@/services/notificationManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';

interface NotificationPermissionState {
  showPermissionScreen: boolean;
  permissionDenied: boolean;
  hasAskedBefore: boolean;
}

const PERMISSION_ASKED_KEY = 'notification_permission_asked';
const PERMISSION_DENIED_KEY = 'notification_permission_denied';

export const useNotificationPermission = () => {
  const [state, setState] = useState<NotificationPermissionState>({
    showPermissionScreen: false,
    permissionDenied: false,
    hasAskedBefore: false,
  });

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // App state listener for permission changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App became active - recheck permissions
        recheckPermission();
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

  const checkPermissionStatus = async () => {
    try {
      const [permissionStatus, hasAskedBefore, wasDenied] = await Promise.all([
        Notifications.getPermissionsAsync(),
        AsyncStorage.getItem(PERMISSION_ASKED_KEY),
        AsyncStorage.getItem(PERMISSION_DENIED_KEY),
      ]);

      const shouldShowScreen =
        permissionStatus.status !== 'granted' && !hasAskedBefore;

      setState({
        showPermissionScreen: shouldShowScreen,
        permissionDenied:
          wasDenied === 'true' && permissionStatus.status === 'denied',
        hasAskedBefore: hasAskedBefore === 'true',
      });
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';

      // Mark that we've asked for permission
      await AsyncStorage.setItem(PERMISSION_ASKED_KEY, 'true');

      if (!granted) {
        // Mark as denied for future reference
        await AsyncStorage.setItem(PERMISSION_DENIED_KEY, 'true');
        setState((prev) => ({
          ...prev,
          permissionDenied: true,
          hasAskedBefore: true,
        }));
      } else {
        // Clear denied flag if granted
        await AsyncStorage.removeItem(PERMISSION_DENIED_KEY);
        setState((prev) => ({
          ...prev,
          showPermissionScreen: false,
          permissionDenied: false,
          hasAskedBefore: true,
        }));

        await notificationManager.updatePreferences({ enabled: true });
      }

      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const openSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  };

  const skipPermission = async () => {
    await AsyncStorage.setItem(PERMISSION_ASKED_KEY, 'true');
    setState((prev) => ({
      ...prev,
      showPermissionScreen: false,
      hasAskedBefore: true,
    }));
  };

  const showPermissionScreenManually = () => {
    setState((prev) => ({ ...prev, showPermissionScreen: true }));
  };

  const hidePermissionScreen = () => {
    setState((prev) => ({ ...prev, showPermissionScreen: false }));
  };

  // Check if permission was granted in settings (when app becomes active)
  const recheckPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        console.log('Permissions detected as granted - updating state');
        await AsyncStorage.removeItem(PERMISSION_DENIED_KEY);
        setState((prev) => ({
          ...prev,
          showPermissionScreen: false,
          permissionDenied: false,
        }));
        await notificationManager.updatePreferences({ enabled: true });
      }
    } catch (error) {
      console.error('Error rechecking permissions:', error);
    }
  };

  return {
    ...state,
    requestPermission,
    openSettings,
    skipPermission,
    showPermissionScreenManually,
    hidePermissionScreen,
    recheckPermission,
  };
};
