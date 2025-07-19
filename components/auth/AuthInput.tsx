import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  halfWidth?: boolean;
  scrollViewRef?: React.RefObject<ScrollView>;
}

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  icon,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  halfWidth = false,
  scrollViewRef,
  ...props
}: AuthInputProps) {
  const inputRef = React.useRef<TextInput>(null);
  const containerRef = React.useRef<View>(null);

  const handleFocus = (e: any) => {
    // Auto-scroll to input when focused (especially helpful for password fields)
    if (scrollViewRef?.current && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.measureInWindow((x, y, width, height) => {
          // Scroll to bring the input into view with some padding
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 100), // 100px padding from top
            animated: true,
          });
        });
      }, 100); // Small delay to ensure keyboard animation starts
    }

    // Call original onFocus if provided
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  return (
    <View ref={containerRef} className={`mb-4 ${halfWidth ? 'flex-1' : ''}`}>
      {label && (
        <Text className='text-gray-700 dark:text-gray-300 text-sm font-medium mb-2'>
          {label}
        </Text>
      )}
      <View className='relative'>
        {icon && (
          <View className='absolute left-3 top-1/2 transform -translate-y-1/2 z-10'>
            <MaterialIcons
              name={icon}
              size={20}
              color={error ? '#EF4444' : '#9CA3AF'}
            />
          </View>
        )}
        <TextInput
          ref={inputRef}
          className={`
            w-full ${icon ? 'pl-12' : 'px-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-4 
            border rounded-xl bg-white text-gray-900
            ${error ? 'border-red-500' : 'border-gray-200 focus:border-primary'}
          `}
          placeholder={placeholder}
          placeholderTextColor='#9CA3AF'
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            className='absolute right-3 top-1/2 transform -translate-y-1/2'
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color='#9CA3AF'
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className='flex-row items-center mt-1'>
          <MaterialIcons name='error' size={16} color='#EF4444' />
          <Text className='text-red-500 text-sm ml-1'>{error}</Text>
        </View>
      )}
    </View>
  );
}
