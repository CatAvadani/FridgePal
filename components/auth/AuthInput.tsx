import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface AuthInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  ...props
}: AuthInputProps) {
  return (
    <TextInput
      className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
      placeholder={placeholder}
      placeholderTextColor='#9CA3AF'
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
}
