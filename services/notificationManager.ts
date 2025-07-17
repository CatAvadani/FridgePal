import { ProductDisplay } from '@/types/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationPreferences {
  enabled: boolean;
  notificationTime: string;
  daysBeforeExpiry: number;
  version?: number;
}

const BACKGROUND_TASK_NAME = 'EXPIRY_NOTIFICATION_TASK';
const PREFERENCES_KEY = 'notification_preferences';

class NotificationManager {
  private static instance: NotificationManager;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing notification manager...');

      // Skip notification setup on Android + Expo Go
      if (Platform.OS === 'android' && __DEV__) {
        // Check if we're in Expo Go vs development build
        try {
          await Notifications.getPermissionsAsync();
        } catch (error) {
          console.log('Skipping notifications on Android Expo Go');
          return false;
        }
      }

      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        console.log('Notification permissions denied');
        return false;
      }

      await this.registerBackgroundTask();

      console.log('Notification manager initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize notification manager:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async scheduleProductNotification(product: ProductDisplay): Promise<void> {
    console.log('=== SCHEDULE FUNCTION CALLED ===', product.productName);
    try {
      const preferences = await this.getPreferences();

      console.log('=== NOTIFICATION CALCULATION DEBUG ===');
      console.log('Product expiration:', product.expirationDate);
      console.log('Days before expiry:', preferences.daysBeforeExpiry);
      console.log('Notification time:', preferences.notificationTime);

      if (!preferences.enabled) {
        console.log('Notifications disabled, skipping schedule');
        return;
      }

      const notificationDate = this.calculateNotificationDate(
        product.expirationDate,
        preferences.daysBeforeExpiry,
        preferences.notificationTime
      );

      console.log(
        'Calculated notification date:',
        notificationDate.toLocaleString()
      );
      console.log('Current date:', new Date().toLocaleString());
      console.log(
        'Is notification date in future?',
        notificationDate > new Date()
      );
      console.log('=======================================');

      if (notificationDate <= new Date()) {
        console.log('Notification date is in the past, skipping');
        return;
      }

      const daysUntilExpiry = Math.ceil(
        (new Date(product.expirationDate).getTime() -
          notificationDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      console.log('Scheduling notification now...');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'FridgePal Alert',
          body: `${product.productName} expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}!`,
          data: {
            productId: product.itemId,
            productName: product.productName,
            expirationDate: product.expirationDate,
            type: 'expiry_alert',
          },
        },
        trigger: {
          type: 'date',
          date: notificationDate,
        } as Notifications.DateTriggerInput,
      });

      console.log(
        `Scheduled notification for ${product.productName} at ${notificationDate.toLocaleString()}`
      );
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async cancelProductNotifications(productId: string): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const productNotifications = scheduled.filter(
        (notification) => notification.content.data?.productId === productId
      );

      for (const notification of productNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }

      console.log(
        `Cancelled ${productNotifications.length} notifications for product ${productId}`
      );
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  }

  async scheduleAllProductNotifications(
    products: ProductDisplay[]
  ): Promise<void> {
    console.log(`Scheduling notifications for ${products.length} products...`);

    for (const product of products) {
      await this.scheduleProductNotification(product);
    }
  }

  async rescheduleAllNotifications(products: ProductDisplay[]): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await this.scheduleAllProductNotifications(products);
      console.log('All notifications rescheduled');
    } catch (error) {
      console.error('Failed to reschedule notifications:', error);
    }
  }

  private async registerBackgroundTask(): Promise<void> {
    try {
      const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_TASK_NAME);

      if (!isTaskDefined) {
        TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
          console.log('Background notification task running...');
          await this.runBackgroundCheck();
          return { data: { success: true } };
        });
      }
    } catch (error) {
      console.error('Failed to register background task:', error);
    }
  }

  private async runBackgroundCheck(): Promise<void> {
    try {
      console.log('Running background notification check...');
      // TODO: Implement background sync with your product data
    } catch (error) {
      console.error('Background check failed:', error);
    }
  }

  private calculateNotificationDate(
    expirationDate: string,
    daysBeforeExpiry: number,
    notificationTime: string
  ): Date {
    const expiryDate = new Date(expirationDate);
    const notificationDate = new Date(expiryDate);

    notificationDate.setDate(expiryDate.getDate() - daysBeforeExpiry);

    const [hours, minutes] = notificationTime.split(':');
    notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return notificationDate;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const isProduction = !__DEV__;

    const defaultPreferences: NotificationPreferences = {
      enabled: true,
      notificationTime: isProduction ? '09:00' : '09:00', // Can be customized via settings
      daysBeforeExpiry: isProduction ? 3 : 0, // Immediate in dev for testing
      version: 1,
    };

    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const storedPrefs = JSON.parse(stored);

        // In development, allow dynamic updates but preserve user changes
        if (!isProduction && !storedPrefs.userModified) {
          // Keep defaults fresh in development unless user explicitly changed them
          const updatedPrefs = { ...defaultPreferences, ...storedPrefs };
          await AsyncStorage.setItem(
            PREFERENCES_KEY,
            JSON.stringify(updatedPrefs)
          );
          return updatedPrefs;
        }

        // In production or if user modified, use stored preferences but ensure all properties exist
        return { ...defaultPreferences, ...storedPrefs };
      }
    } catch (error) {
      console.error('Failed to get preferences:', error);
    }

    // Save and return defaults
    await AsyncStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify(defaultPreferences)
    );
    return defaultPreferences;
  }

  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = {
        ...current,
        ...preferences,
        userModified: true, // Mark as user-modified to preserve changes
      };
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      console.log('Preferences updated:', updated);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }

  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`Found ${scheduled.length} scheduled notifications`);
      return scheduled;
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cleared');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }
}

export const notificationManager = NotificationManager.getInstance();
export type { NotificationPreferences };
