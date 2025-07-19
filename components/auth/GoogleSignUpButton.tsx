import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface GoogleSignUpButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignUpButton({
  onPress,
  disabled = false,
}: GoogleSignUpButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className='w-full py-4 border border-gray-200 rounded-xl bg-white mb-6 flex-row items-center justify-center'
    >
      <MaterialIcons name='login' size={20} color='#9CA3AF' />
      <Text className='text-gray-700 font-medium text-lg text-center ml-2'>
        Sign Up with Google
      </Text>
    </TouchableOpacity>
  );
}
