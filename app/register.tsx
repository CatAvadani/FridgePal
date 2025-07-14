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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Simulate registration process
    try {
      // Add registration logic here
      console.log('Registration attempt:', { name, email, password });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'Something went wrong. Please try again.'
      );
    }
  };

  const navigateToLogin = () => {
    router.back();
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
                Create Account
              </Text>
              <Text className='text-gray-600 text-center'>
                Join FridgePal to manage your food inventory
              </Text>
            </View>

            <View className='space-y-4'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </Text>
                <TextInput
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white'
                  placeholder='Enter your full name'
                  value={name}
                  onChangeText={setName}
                />
              </View>

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
                  placeholder='Create a password'
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>
                  Confirm Password
                </Text>
                <TextInput
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className='w-full bg-primary py-3 rounded-lg mt-6'
                onPress={handleRegister}
              >
                <Text className='text-white text-center font-semibold text-lg'>
                  Create Account
                </Text>
              </TouchableOpacity>

              <View className='flex-row justify-center mt-6'>
                <Text className='text-gray-600'>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text className='text-blue-600 font-bold'>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
