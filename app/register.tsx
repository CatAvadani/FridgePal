import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleSignUpButton from '@/components/auth/GoogleSignUpButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

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

    try {
      console.log('Registration attempt:', {
        firstName,
        lastName,
        email,
        password,
      });
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
    Alert.alert('Google Sign Up', 'Google sign up functionality would go here');
  };

  const navigateToLogin = () => {
    router.replace('/login');
  };

  return (
    <AuthLayout>
      <AuthHeader
        title='Create Your Account'
        subtitle='Join FridgePal to manage your food inventory'
      />

      <View className='gap-4 mb-6'>
        <View className='flex-row gap-2'>
          <View className='flex-1'>
            <AuthInput
              placeholder='First Name'
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View className='flex-1'>
            <AuthInput
              placeholder='Last Name'
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <AuthInput
          placeholder='Email Address'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <AuthInput
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <AuthButton title='Create Account' onPress={handleRegister} />

      <Text className='text-xs text-gray-500 text-center mb-6 leading-4'>
        By creating an account, you agree to our{' '}
        <Text className='text-blue-600'>Terms and Conditions</Text>
      </Text>

      <GoogleSignUpButton onPress={handleGoogleSignUp} />

      <View className='flex-row justify-center'>
        <Text className='text-gray-600'>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text className='text-blue-600 font-bold'>Sign In</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
