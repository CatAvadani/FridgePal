import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

interface GoogleSignUpButtonProps {
  onPress: () => void;
}

export default function GoogleSignUpButton({
  onPress,
}: GoogleSignUpButtonProps) {
  return (
    <TouchableOpacity
      className='w-full py-4 rounded-xl border border-gray-200 bg-white mb-6 flex-row items-center justify-center'
      onPress={onPress}
    >
      <Image
        source={require('@/assets/images/google_icon.png')}
        className='w-5 h-5 mr-4'
        resizeMode='cover'
      />
      <Text className='text-gray-700 font-medium text-lg ml-2'>
        Sign Up with Google
      </Text>
    </TouchableOpacity>
  );
}
