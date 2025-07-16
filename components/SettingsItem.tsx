import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

export interface SettingsItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
}

export default function SettingsItem({
  title,
  subtitle,
  onPress,
  showArrow = true,
  isToggle = false,
  toggleValue,
  onToggle,
  isDestructive = false,
}: SettingsItemProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 ${
        isDestructive ? 'bg-red-50 dark:bg-red-900' : ''
      }`}
      onPress={onPress}
      disabled={isToggle}
    >
      <View className='flex-1'>
        <Text
          className={`text-base font-medium ${
            isDestructive
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            {subtitle}
          </Text>
        )}
      </View>

      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: '#FF6B47' }}
          thumbColor={toggleValue ? '#f4f3f4' : '#f4f3f4'}
        />
      ) : showArrow ? (
        <MaterialIcons
          name='keyboard-arrow-right'
          size={20}
          color={isDarkMode ? 'gray' : 'black'}
          className='mr-2'
        />
      ) : null}
    </TouchableOpacity>
  );
}
