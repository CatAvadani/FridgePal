import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthLoadingScreen() {
  return (
    <View className='flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900'>
      <Text className='text-2xl font-bold text-gray-900 dark:text-white mb-8'>
        FridgePal
      </Text>
      <ActivityIndicator size='large' color='#4F46E5' />
      <Text className='text-gray-600 dark:text-gray-400 mt-4'>Loading...</Text>
    </View>
  );
}
