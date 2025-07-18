import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface NotificationPermissionScreenProps {
  visible: boolean;
  onRequestPermission: () => Promise<boolean>;
  onSkip: () => void;
  onOpenSettings: () => void;
  permissionDenied?: boolean;
}

const NotificationPermissionScreen: React.FC<
  NotificationPermissionScreenProps
> = ({
  visible,
  onRequestPermission,
  onSkip,
  onOpenSettings,
  permissionDenied = false,
}) => {
  const handleEnableNotifications = async () => {
    if (permissionDenied) {
      onOpenSettings();
    } else {
      const granted = await onRequestPermission();
      if (!granted) {
        // Permission was denied, but don't close modal yet
        // The parent component will handle showing the denied state
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
    >
      <View className='flex-1 bg-white dark:bg-gray-900'>
        {/* Header */}
        <View className='pt-12 pb-8 px-6'>
          <View className='flex-row justify-between items-center'>
            <View className='w-6' />
            <Text className='text-lg font-semibold text-gray-800 dark:text-white'>
              {permissionDenied ? 'Enable Notifications' : 'Stay Fresh!'}
            </Text>
            <TouchableOpacity onPress={onSkip} className='p-1'>
              <MaterialIcons name='close' size={24} color='#9CA3AF' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='flex-1 px-6'>
          <View className='items-center mb-8'>
            <View className='w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mb-6'>
              <MaterialIcons
                name='notifications-active'
                size={48}
                color='#3B82F6'
              />
            </View>

            <Text className='text-2xl font-bold text-gray-800 dark:text-white text-center mb-4'>
              {permissionDenied
                ? "Don't Miss Your Food!"
                : 'Never Waste Food Again!'}
            </Text>

            <Text className='text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed'>
              {permissionDenied
                ? 'Notifications are currently disabled. Enable them to get timely reminders about expiring food.'
                : 'Get notified 3 days before your food expires so you can use it before it goes bad.'}
            </Text>
          </View>

          <View className='mb-8'>
            <View className='flex-row items-center mb-4'>
              <View className='w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center mr-4'>
                <MaterialIcons name='schedule' size={20} color='#10B981' />
              </View>
              <View className='flex-1'>
                <Text className='text-gray-800 dark:text-white font-medium'>
                  Timely Reminders
                </Text>
                <Text className='text-gray-600 dark:text-gray-300 text-sm'>
                  Get alerted before food expires
                </Text>
              </View>
            </View>

            <View className='flex-row items-center mb-4'>
              <View className='w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full items-center justify-center mr-4'>
                <MaterialIcons name='money-off' size={20} color='#EF4444' />
              </View>
              <View className='flex-1'>
                <Text className='text-gray-800 dark:text-white font-medium'>
                  Save Money
                </Text>
                <Text className='text-gray-600 dark:text-gray-300 text-sm'>
                  Reduce food waste and grocery costs
                </Text>
              </View>
            </View>

            <View className='flex-row items-center mb-6'>
              <View className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mr-4'>
                <MaterialIcons name='eco' size={20} color='#3B82F6' />
              </View>
              <View className='flex-1'>
                <Text className='text-gray-800 dark:text-white font-medium'>
                  Help the Environment
                </Text>
                <Text className='text-gray-600 dark:text-gray-300 text-sm'>
                  Reduce your environmental impact
                </Text>
              </View>
            </View>
          </View>

          {permissionDenied && (
            <View className='mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
              <Text className='text-yellow-800 dark:text-yellow-200 font-medium mb-2'>
                How to enable notifications:
              </Text>
              <Text className='text-yellow-700 dark:text-yellow-300 text-sm'>
                {Platform.OS === 'ios'
                  ? '1. Go to iPhone Settings\n2. Find "FridgePal"\n3. Tap Notifications\n4. Turn on "Allow Notifications"'
                  : '1. Go to Android Settings\n2. Find "Apps" or "Application Manager"\n3. Find "FridgePal"\n4. Tap Notifications\n5. Turn on notifications'}
              </Text>
            </View>
          )}
        </View>

        <View className='px-6 pb-8'>
          <TouchableOpacity
            onPress={handleEnableNotifications}
            className='bg-blue-500 rounded-lg py-4 mb-3'
          >
            <Text className='text-white text-center font-semibold text-lg'>
              {permissionDenied ? 'Open Settings' : 'Enable Notifications'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} className='py-3'>
            <Text className='text-gray-500 text-center font-medium'>
              {permissionDenied ? 'Maybe Later' : 'Skip for Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationPermissionScreen;
