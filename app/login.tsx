import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      console.log('Login attempt:', { username, password });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality would go here'
    );
  };

  const navigateToRegister = () => {
    router.replace('/register');
  };

  return (
    <AuthLayout>
      <View className='flex-1 justify-center'>
        <AuthHeader title='Welcome back, Cat!' />

        <View className='gap-4 mb-6'>
          <AuthInput
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
          />
          <AuthInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <AuthButton title='Sign In' onPress={handleLogin} />

        <TouchableOpacity onPress={handleForgotPassword} className='mb-8'>
          <Text className='text-blue-600 text-center font-medium'>
            Forgot Password
          </Text>
        </TouchableOpacity>

        <View className='flex-row justify-center'>
          <Text className='text-gray-600'>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text className='text-blue-600 font-bold'>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}
