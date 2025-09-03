import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: React.ReactNode;
  disabledReason?: string;
}

export default function AuthButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  icon,
  disabled,
  disabledReason,
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyle =
    variant === 'primary'
      ? `w-full py-3 rounded-xl mb-2 flex-row items-center justify-center ${
          isDisabled ? 'bg-gray-200 dark:bg-gray-600' : 'bg-primary'
        }`
      : 'w-full py-4 rounded-xl border border-gray-200 bg-white mb-6 flex-row items-center justify-center';

  const textStyle =
    variant === 'primary'
      ? `font-semibold text-lg ${isDisabled ? 'text-gray-500 dark:text-gray-300' : 'text-white'}`
      : 'text-gray-700 font-medium text-lg text-center';

  return (
    <>
      <TouchableOpacity
        className={buttonStyle}
        onPress={onPress}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? 'white' : '#9CA3AF'}
            size='small'
          />
        ) : (
          <>
            {icon && <View className='mr-2'>{icon}</View>}
            <Text className={textStyle}>{title}</Text>
          </>
        )}
      </TouchableOpacity>

      {isDisabled && !loading && disabledReason && (
        <Text className='text-xs text-gray-500 text-center mb-4 px-4'>
          {disabledReason}
        </Text>
      )}
    </>
  );
}
