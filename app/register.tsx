import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Simulate registration process
    try {
      console.log('Registration attempt:', {
        firstName,
        lastName,
        email,
        password,
      });

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

  const handleGoogleSignUp = () => {
    // Implement Google sign up
    Alert.alert('Google Sign Up', 'Google sign up functionality would go here');
  };

  const navigateToLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='flex-1 px-6 pt-8'>
            {/* Header */}
            <View className='items-center mb-8'>
              <Text className='text-xl font-semibold text-gray-900 mb-8'>
                FridgePal
              </Text>
              <Text className='text-2xl font-bold text-gray-900 mb-2'>
                Create Your Account
              </Text>
            </View>

            {/* Form Fields */}
            <View className='gap-4 mb-6'>
              {/* Name Fields Row */}
              <View className='flex-row gap-2'>
                <View className='flex-1'>
                  <TextInput
                    className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
                    placeholder='First Name'
                    placeholderTextColor='#9CA3AF'
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View className='flex-1'>
                  <TextInput
                    className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
                    placeholder='Last Name'
                    placeholderTextColor='#9CA3AF'
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              {/* Email Field */}
              <TextInput
                className='w-full px-4 py-4 border border-gray-200 rounded-xl bg-white text-gray-900'
                placeholder='Email Address'
                placeholderTextColor='#9CA3AF'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
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

            {/* Create Account Button */}
            <TouchableOpacity
              className='w-full py-3 rounded-xl shadow-md bg-primary mb-4'
              onPress={handleRegister}
            >
              <Text className='text-white text-center font-semibold text-lg'>
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Terms Text */}
            <Text className='text-xs text-gray-500 text-center mb-6 leading-4'>
              By creating an account, you agree to our{' '}
              <Text className='text-blue-600'>Terms and Conditions</Text>
            </Text>

            {/* Google Sign Up */}
            <TouchableOpacity
              className='w-full py-4 rounded-xl border border-gray-200 bg-white mb-6 flex-row items-center justify-center'
              onPress={handleGoogleSignUp}
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

            {/* Sign In Link */}
            <View className='flex-row justify-center'>
              <Text className='text-gray-600'>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text className='text-blue-600 font-bold'>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
