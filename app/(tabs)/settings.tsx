import SettingsItem from '@/components/SettingsItem';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { notificationManager } from '@/services/notificationManager';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load current notification preferences on mount
  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const prefs = await notificationManager.getPreferences();
      setNotificationsEnabled(prefs.enabled);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handleLogout = () => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      icon: 'alert-circle',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              await logout();
              console.log('Logout successful, navigating to login');
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', 'Please try again.');
            }
          },
        },
      ],
    });
  };

  // Fixed notification toggle handler
  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      await notificationManager.updatePreferences({ enabled });
      setNotificationsEnabled(enabled);
      console.log('Notification preferences updated:', { enabled });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  // Test functions
  const debugNotifications = async () => {
    console.log('=== NOTIFICATION DEBUG ===');

    try {
      const prefs = await notificationManager.getPreferences();
      console.log('Current preferences:', prefs);
    } catch (error) {
      console.log('Error getting preferences:', error);
    }

    const permissions = await Notifications.getPermissionsAsync();
    console.log('Permissions:', permissions.status);

    const scheduled = await notificationManager.getScheduledNotifications();
    console.log('Scheduled count:', scheduled.length);

    scheduled.forEach((notification, index) => {
      console.log(
        `${index + 1}. ${notification.content.title} - ${notification.content.body}`
      );
    });

    console.log('========================');
  };

  const testImmediateNotification = async () => {
    const testDate = new Date();
    testDate.setSeconds(testDate.getSeconds() + 10);

    console.log(
      'Scheduling test notification for:',
      testDate.toLocaleTimeString()
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'FridgePal Test',
        body: 'Test notification working!',
      },
      trigger: {
        type: 'date',
        date: testDate,
      } as Notifications.DateTriggerInput,
    });

    console.log(
      'Test notification scheduled - background the app and wait 10 seconds'
    );
  };

  // Quick test notification with current time + 1 minute
  const testQuickNotification = async () => {
    const testTime = new Date();
    testTime.setMinutes(testTime.getMinutes() + 1);
    const timeString = testTime.toTimeString().slice(0, 5); // "HH:MM"

    try {
      await notificationManager.updatePreferences({
        notificationTime: timeString,
        daysBeforeExpiry: 0,
      });
      console.log(`Updated notification time to ${timeString} for testing`);

      showAlert({
        title: 'Test Setup',
        message: `Notification time set to ${timeString}. Create a product with today's expiration date to test!`,
        icon: 'check-circle',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } catch (error) {
      console.error('Error setting test time:', error);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-6 py-3 bg-gray-50 dark:bg-gray-900'>
      {title}
    </Text>
  );

  const headerClassName = `flex-row items-center justify-between pb-3 ${
    Platform.OS === 'android' ? 'pt-10' : 'pt-0'
  }`;

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <ScrollView className='flex-1'>
        {/* Header */}
        <View className='bg-transparent dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4'>
          <View className={headerClassName}>
            <TouchableOpacity onPress={() => router.back()} className='p-2'>
              <MaterialIcons
                name='arrow-back'
                size={24}
                color={isDarkMode ? 'gray' : '#000'}
              />
            </TouchableOpacity>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
              Settings
            </Text>
            <View className='w-10' />
          </View>
        </View>

        {/* User Info Section */}
        {user && (
          <>
            <SectionHeader title='Profile' />
            <SettingsItem
              title={`${user.firstName || 'User'} ${user.lastName || ''}`}
              subtitle={user.email}
              onPress={() =>
                Alert.alert('Profile', 'Profile editing would go here')
              }
            />
          </>
        )}

        <SectionHeader title='Preferences' />
        <SettingsItem
          title='Notifications'
          subtitle='Get alerts when food is about to expire'
          isToggle={true}
          toggleValue={notificationsEnabled}
          onToggle={handleNotificationToggle}
        />
        <SettingsItem
          title='Dark Mode'
          subtitle='Switch between light and dark themes'
          isToggle={true}
          toggleValue={darkMode}
          onToggle={setDarkMode}
        />

        <SectionHeader title='Support' />
        <SettingsItem
          title='Help & Support'
          subtitle='Get help and contact support'
          onPress={() => Alert.alert('Help', 'Help section would go here')}
        />
        <SettingsItem
          title='About'
          subtitle='Version 1.0.0'
          onPress={() =>
            Alert.alert('About', 'App info and terms would go here')
          }
        />

        <SectionHeader title='Sign Out' />
        <SettingsItem
          title='Logout'
          subtitle='Sign out of your account'
          onPress={handleLogout}
          showArrow={false}
        />

        <View className='h-6' />

        {/* Development Testing Section */}
        {__DEV__ && (
          <>
            <SectionHeader title='Development' />
            <View className='px-4 py-4 bg-yellow-100 m-4 rounded-lg'>
              <Text className='text-lg font-bold mb-4'>
                Notification Testing
              </Text>

              <TouchableOpacity
                onPress={debugNotifications}
                className='bg-blue-500 p-3 rounded-lg mb-2'
              >
                <Text className='text-white text-center font-semibold'>
                  Debug Notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testImmediateNotification}
                className='bg-green-500 p-3 rounded-lg mb-2'
              >
                <Text className='text-white text-center font-semibold'>
                  Test Immediate (10 sec)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={testQuickNotification}
                className='bg-purple-500 p-3 rounded-lg'
              >
                <Text className='text-white text-center font-semibold'>
                  Set Test Time (+1 min)
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
