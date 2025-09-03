import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
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
  scrollViewRef?: React.RefObject<ScrollView | null>;
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
    if (scrollViewRef?.current && containerRef.current) {
      // Use requestAnimationFrame to ensure layout is complete
      requestAnimationFrame(() => {
        containerRef.current?.measureInWindow((x, y, width, height) => {
          // Get keyboard height based on platform
          const keyboardHeight = Platform.select({
            ios: 336, // iOS keyboard with suggestions
            android: 300,
            default: 300,
          });

          const windowHeight = Dimensions.get('window').height;
          const inputBottom = y + height;
          const keyboardTop = windowHeight - keyboardHeight;

          // Add extra padding to ensure input is visible above keyboard
          const extraPadding = 20;

          if (inputBottom > keyboardTop - extraPadding) {
            const scrollAmount = inputBottom - keyboardTop + extraPadding + 50;

            scrollViewRef.current?.scrollTo({
              y: scrollAmount,
              animated: true,
            });
          }
        });
      });
    }

    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    // Optionally scroll back to top when keyboard dismisses
    if (Platform.OS === 'ios' && scrollViewRef?.current) {
      setTimeout(() => {
        if (Keyboard.isVisible && Keyboard.isVisible() === false) {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }
      }, 100);
    }

    if (props.onBlur) {
      props.onBlur(e);
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
            border rounded-xl bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600
            ${error ? 'border-red-500' : 'border-gray-200 focus:border-primary'}
          `}
          placeholder={placeholder}
          placeholderTextColor='#9CA3AF'
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
