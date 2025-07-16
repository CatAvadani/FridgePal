import React from 'react';
import { Text, View } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className='items-center mb-8'>
      <Text className='text-xl font-semibold text-gray-900 mb-8'>
        FridgePal
      </Text>
      <Text className='text-2xl font-bold text-gray-900 mb-2'>{title}</Text>
      {subtitle && (
        <Text className='text-gray-600 text-center'>{subtitle}</Text>
      )}
    </View>
  );
}
