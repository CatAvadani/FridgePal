import SettingsItem from '@/components/SettingsItem';
import TimePicker from '@/components/TimePicker';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { notificationManager } from '@/services/notificationManager';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
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
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load current notification preferences on mount
  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const prefs = await notificationManager.getPreferences();
      setNotificationsEnabled(prefs.enabled);
      setNotificationTime(prefs.notificationTime);
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

  // Format time for display (convert 24h to 12h format)
  const formatDisplayTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
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

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-6 py-3 bg-gray-50 dark:bg-gray-900'>
      {title}
    </Text>
  );

  const headerClassName = `flex-row items-center justify-between pb-3 ${
    Platform.OS === 'android' ? 'pt-10' : 'pt-0'
  }`;

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900 pb-28'>
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
        {notificationsEnabled && (
          <SettingsItem
            title='Notification Time'
            subtitle={`Daily alerts at ${formatDisplayTime(notificationTime)}`}
            onPress={() => {
              console.log('Notification time tapped!');
              console.log('Current platform:', Platform.OS);
              console.log('Show time picker state:', showTimePicker);
              setShowTimePicker(true);
              console.log('Set showTimePicker to true');
            }}
          />
        )}
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

        <SettingsItem
          title='Privacy Policy'
          subtitle='How we handle your data'
          onPress={() =>
            Linking.openURL('https://catavadani.github.io/fridgepal-privacy/')
          }
        />

        <TimePicker
          visible={showTimePicker}
          initialTime={notificationTime}
          onTimeSelect={async (selectedTime) => {
            setNotificationTime(selectedTime);
            setShowTimePicker(false);

            try {
              await notificationManager.updatePreferences({
                notificationTime: selectedTime,
              });

              showAlert({
                title: 'Time Updated',
                message: `Notification time changed to ${formatDisplayTime(selectedTime)}`,
                icon: 'check-circle',
                buttons: [{ text: 'OK', style: 'default' }],
              });
            } catch (error) {
              console.error('Error updating notification time:', error);
            }
          }}
          onCancel={() => setShowTimePicker(false)}
          isDarkMode={isDarkMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
