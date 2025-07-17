import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const result = await signIn(email, password);

      if (result.success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Sign In Failed', result.message);
      }
    } catch (error) {
      Alert.alert(
        'Sign In Failed',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon!');
  };

  const navigateToRegister = () => {
    router.replace('/register');
  };

  return (
    <AuthLayout>
      <View className='flex-1 justify-center'>
        <AuthHeader title='Welcome back!' />

        <View className='gap-4 mb-6'>
          <AuthInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
            editable={!isLoading}
          />
          <AuthInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete='password'
            editable={!isLoading}
          />
        </View>

        <AuthButton
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleSignIn}
          disabled={isLoading}
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          className='mb-8'
          disabled={isLoading}
        >
          <Text className='text-blue-600 text-center font-medium'>
            Forgot Password
          </Text>
        </TouchableOpacity>

        <View className='flex-row justify-center'>
          <Text className='text-gray-600'>Don&#39;t have an account? </Text>
          <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
            <Text className='text-blue-600 font-bold'>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}
