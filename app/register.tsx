import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import GoogleSignUpButton from '@/components/auth/GoogleSignUpButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    console.log('🎯 Starting handleRegister...');

    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await signUp(email, password, firstName, lastName);

      if (result.success) {
        // Show success message
        Alert.alert('Success!', result.message, [
          {
            text: 'OK',
            onPress: () => {
              // If email verification is required, go to login
              // If auto-signed in, navigation will happen via auth state change
              if (result.message.includes('email verification')) {
                router.replace('/login');
              } else {
                router.replace('/(tabs)/home');
              }
            },
          },
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google Sign Up', 'Google sign up functionality coming soon!');
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
              editable={!isLoading}
            />
          </View>
          <View className='flex-1'>
            <AuthInput
              placeholder='Last Name'
              value={lastName}
              onChangeText={setLastName}
              editable={!isLoading}
            />
          </View>
        </View>

        <AuthInput
          placeholder='Email Address'
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
          autoComplete='new-password'
          editable={!isLoading}
        />
      </View>

      <AuthButton
        title={isLoading ? 'Creating Account...' : 'Create Account'}
        onPress={handleRegister}
        disabled={isLoading}
      />

      <Text className='text-xs text-gray-500 text-center mb-6 leading-4'>
        By creating an account, you agree to our{' '}
        <Text className='text-blue-600'>Terms and Conditions</Text>
      </Text>

      <GoogleSignUpButton onPress={handleGoogleSignUp} />

      <View className='flex-row justify-center'>
        <Text className='text-gray-600'>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToLogin} disabled={isLoading}>
          <Text className='text-blue-600 font-bold'>Sign In</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
