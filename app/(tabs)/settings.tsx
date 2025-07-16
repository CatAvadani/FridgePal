import SettingsItem from '@/components/SettingsItem';
import { useAlert } from '@/hooks/useCustomAlert';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
          onPress: () => {
            //Todo: Add logout logic here
            router.replace('/login');
          },
        },
      ],
    });
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

        {/* Profile Section */}
        <SectionHeader title='Profile' />
        <SettingsItem
          title='Edit Profile'
          subtitle='Update your personal information'
          onPress={() =>
            Alert.alert('Edit Profile', 'Profile editing would go here')
          }
        />

        <SectionHeader title='Preferences' />
        <SettingsItem
          title='Notifications'
          subtitle='Get alerts when food is about to expire'
          isToggle={true}
          toggleValue={notificationsEnabled}
          onToggle={setNotificationsEnabled}
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

        <SectionHeader title='Account' />
        <SettingsItem
          title='Logout'
          subtitle='Sign out of your account'
          onPress={handleLogout}
          showArrow={false}
        />

        <View className='h-6' />
      </ScrollView>
    </SafeAreaView>
  );
}
