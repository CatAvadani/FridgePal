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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate login process
    try {
      // Add login logic here
      // For now, simulate a successful login
      console.log('Login attempt:', { email, password });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className='flex-1'>
          <View className='flex-1 justify-center px-6 py-12'>
            <View className='mb-8'>
              <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>
                Welcome Back!
              </Text>
              <Text className='text-gray-600 text-center'>
                Sign in to your FridgePal account
              </Text>
            </View>

            <View className='space-y-4'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Email
                </Text>
                <TextInput
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white'
                  placeholder='Enter your email'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Password
                </Text>
                <TextInput
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white'
                  placeholder='Enter your password'
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className='w-full bg-primary py-3 rounded-lg mt-6'
                onPress={handleLogin}
              >
                <Text className='text-white text-center font-semibold text-lg'>
                  Sign In
                </Text>
              </TouchableOpacity>

              <View className='flex-row justify-center mt-6'>
                <Text className='text-gray-600'>
                  Don&apos;t have an account?{' '}
                </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text className='text-blue-600 font-bold'>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
