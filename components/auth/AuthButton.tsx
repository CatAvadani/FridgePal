import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function AuthButton({
  title,
  onPress,
  variant = 'primary',
  ...props
}: AuthButtonProps) {
  const buttonStyle =
    variant === 'primary'
      ? 'w-full py-3 rounded-xl shadow-md bg-primary mb-4'
      : 'w-full py-4 rounded-xl border border-gray-200 bg-white mb-6';

  const textStyle =
    variant === 'primary'
      ? 'text-white text-center font-semibold text-lg'
      : 'text-gray-700 font-medium text-lg text-center';

  return (
    <TouchableOpacity className={buttonStyle} onPress={onPress} {...props}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
