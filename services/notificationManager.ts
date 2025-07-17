import { ProductDisplay } from '@/types/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

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

  //  NOTIFICATION SCHEDULING
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

      // Don't schedule if date is in the past
      if (notificationDate <= new Date()) {
        console.log('Notification date is in the past, skipping');
        return;
      }

      // Calculate days until expiry for notification message
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

      // Schedule new notifications
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
      // This would be called daily in the background
      // For now, we'll just log - need to implement actual product checking here
      console.log('Running background notification check...');

      // TODO: Implement background sync with your product data
      // 1. Get all user products
      // 2. Check for items expiring in 3 days
      // 3. Ensure notifications are scheduled
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

    // Set to X days before expiry
    notificationDate.setDate(expiryDate.getDate() - daysBeforeExpiry);

    // Set specific time (e.g., 9:00 AM)
    const [hours, minutes] = notificationTime.split(':');
    notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return notificationDate;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get preferences:', error);
    }

    // Default preferences
    return {
      enabled: true,
      notificationTime: '17:58',
      daysBeforeExpiry: 0,
    };
  }

  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
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
