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
      console.log('Failed to initialize notification manager:', error);
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
      console.log('Permission request failed:', error);
      return false;
    }
  }

  async scheduleProductNotification(product: ProductDisplay): Promise<void> {
    try {
      const preferences = await this.getPreferences();

      if (!preferences.enabled) {
        console.log('Notifications disabled, skipping schedule');
        return;
      }

      const notificationDate = this.calculateNotificationDate(
        product.expirationDate,
        preferences.daysBeforeExpiry,
        preferences.notificationTime
      );

      // Skip if notification date is in the past
      if (notificationDate <= new Date()) {
        console.log(
          `Notification date is in the past for ${product.productName}, skipping`
        );
        return;
      }

      const daysUntilExpiry = Math.ceil(
        (new Date(product.expirationDate).getTime() -
          notificationDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

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
      console.log('Failed to schedule notification:', error);
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
      console.log('Failed to cancel notifications:', error);
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
      console.log('Failed to reschedule notifications:', error);
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
      console.log('Failed to register background task:', error);
    }
  }

  private async runBackgroundCheck(): Promise<void> {
    try {
      console.log('Running background notification check...');
      // TODO: Implement background sync with your product data
    } catch (error) {
      console.log('Background check failed:', error);
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

    // Handle same-day notifications: if calculated time is in the past,
    // schedule for 30 seconds from now instead of skipping entirely
    if (daysBeforeExpiry === 0 && notificationDate <= new Date()) {
      return new Date(Date.now() + 30 * 1000); // 30 seconds from now
    }

    return notificationDate;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const defaultPreferences: NotificationPreferences = {
      enabled: true,
      notificationTime: '09:00',
      daysBeforeExpiry: 3,
      version: 1,
    };

    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const storedPrefs = JSON.parse(stored);
        return { ...defaultPreferences, ...storedPrefs };
      }
    } catch (error) {
      console.log('Failed to get preferences:', error);
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
      console.log('Failed to update preferences:', error);
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
      console.log('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cleared');
    } catch (error) {
      console.log('Failed to clear notifications:', error);
    }
  }

  // Keep these methods for debugging/admin purposes - they don't interfere with production
  async testNotificationImmediately(): Promise<void> {
    if (!__DEV__) return; // Only allow in development

    console.log('=== TESTING IMMEDIATE NOTIFICATION ===');

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'FridgePal Test',
          body: 'If you see this, notifications work!',
          data: { type: 'test' },
        },
        trigger: {
          type: 'date',
          date: new Date(Date.now() + 3000), // 3 seconds from now
        } as Notifications.DateTriggerInput,
      });

      console.log('Test notification scheduled for 3 seconds');
    } catch (error) {
      console.log('Test notification failed:', error);
    }
  }

  async checkScheduledNotifications(): Promise<void> {
    const scheduled = await this.getScheduledNotifications();
    console.log(`Found ${scheduled.length} scheduled notifications:`);

    scheduled.forEach((notif, index) => {
      const trigger = notif.trigger as any;
      let displayDate = 'Unknown date';

      if (trigger.date) {
        displayDate = new Date(trigger.date).toLocaleString();
      } else if (trigger.dateComponents) {
        displayDate = new Date(trigger.dateComponents).toLocaleString();
      }

      console.log(`${index + 1}. ${notif.content.title} - ${displayDate}`);
    });
  }
}

export const notificationManager = NotificationManager.getInstance();
export type { NotificationPreferences };
