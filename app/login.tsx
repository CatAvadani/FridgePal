import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate login process
    try {
      console.log('Login attempt:', { username, password });

      // Simulate API call delay
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
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='flex-1 justify-center px-6 py-12'>
            {/* Header */}
            <View className='items-center mb-12'>
              <Text className='text-xl font-semibold text-gray-900 mb-8'>
                FridgePal
              </Text>
              <Text className='text-2xl font-bold text-gray-900 mb-2'>
                Welcome back, Cat!
              </Text>
            </View>

            {/* Form Fields */}
            <View
              className='
          gap-4 mb-6'
            >
              {/* Username Field */}
              <TextInput
                className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
                placeholder='Username'
                placeholderTextColor='#9CA3AF'
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
              />

              {/* Password Field */}
              <TextInput
                className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
                placeholder='Password'
                placeholderTextColor='#9CA3AF'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              className='w-full py-3 mb-4 rounded-xl shadow-md bg-primary'
              onPress={handleLogin}
            >
              <Text className='text-white text-center font-semibold text-lg'>
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className='mb-8'>
              <Text className='text-blue-600 text-center font-medium'>
                Forgot Password
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className='flex-row justify-center'>
              <Text className='text-gray-600'>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text className='text-blue-600 font-bold'>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
