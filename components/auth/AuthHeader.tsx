import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  customImage?: any;
  imageSize?: number;
}

export default function AuthHeader({
  title,
  subtitle,
  showLogo = true,
  customImage,
  imageSize = 80,
}: AuthHeaderProps) {
  return (
    <View className='items-center mb-8'>
      {showLogo && (
        <>
          {customImage ? (
            <View className='mb-4'>
              <Image
                source={customImage}
                style={{
                  width: imageSize,
                  height: imageSize,
                  borderRadius: imageSize / 2,
                }}
                resizeMode='cover'
              />
            </View>
          ) : (
            // Fallback to icon
            <View className='w-20 h-20 bg-primary rounded-full items-center justify-center mb-4'>
              <MaterialIcons name='kitchen' size={40} color='white' />
            </View>
          )}
          <Text className='text-xl font-semibold text-gray-900 mb-4'>
            FridgePal
          </Text>
        </>
      )}
      <Text className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
        {title}
      </Text>
      {subtitle && (
        <Text className='text-gray-600 dark:text-gray-400 text-center'>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
