import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrenghtIndicator';
import { useAuth } from '@/contexts/AuthContext';
import {
  RegisterFormData,
  mapSupabaseError,
  registerSchema,
} from '@/utils/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedFields = watch();

  const getDisabledReason = (): string | undefined => {
    if (!isDirty) return 'Please fill out the registration form';

    const { firstName, lastName, email, password, confirmPassword } =
      watchedFields;

    // Check for empty required fields
    if (!firstName?.trim()) return 'Please enter your first name';
    if (!lastName?.trim()) return 'Please enter your last name';
    if (!email?.trim()) return 'Please enter your email address';
    if (!password?.trim()) return 'Please create a password';
    if (!confirmPassword?.trim()) return 'Please confirm your password';

    // Check for validation errors
    if (errors.firstName) return 'Please check your first name';
    if (errors.lastName) return 'Please check your last name';
    if (errors.email) return 'Please enter a valid email address';
    if (errors.password) return 'Please create a stronger password';
    if (errors.confirmPassword) return "Passwords don't match";

    return undefined;
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await signUp(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      if (result.success) {
        Alert.alert('Success!', result.message, [
          {
            text: 'OK',
            onPress: () => {
              if (result.message.includes('email verification')) {
                router.replace('/login');
              } else {
                router.replace('/(tabs)/home');
              }
            },
          },
        ]);
      } else {
        const errorMessage = mapSupabaseError(result.error);
        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title='Create Your Account'
        subtitle='Join FridgePal to manage your food inventory'
        customImage={require('@/assets/images/welcome_img.png')}
        imageSize={90}
      />

      <View className=' mb-6'>
        {/* Name Fields */}
        <View className='flex-row gap-2'>
          <Controller
            control={control}
            name='firstName'
            render={({ field: { onChange, value } }) => (
              <AuthInput
                label='First Name'
                placeholder='First name'
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
                icon='person'
                halfWidth
              />
            )}
          />

          <Controller
            control={control}
            name='lastName'
            render={({ field: { onChange, value } }) => (
              <AuthInput
                label='Last Name'
                placeholder='Last name'
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
                icon='person'
                halfWidth
              />
            )}
          />
        </View>

        {/* Email */}
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, value } }) => (
            <AuthInput
              label='Email Address'
              placeholder='Enter your email'
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType='email-address'
              autoCapitalize='none'
              icon='email'
            />
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name='password'
          render={({ field: { onChange, value } }) => (
            <View>
              <AuthInput
                label='Password'
                placeholder='Create a password'
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
                icon='lock'
                showPasswordToggle
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />
              <PasswordStrengthIndicator password={value} />
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange, value } }) => (
            <AuthInput
              label='Confirm Password'
              placeholder='Confirm your password'
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize='none'
              icon='lock'
              showPasswordToggle
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              showPassword={showConfirmPassword}
            />
          )}
        />
      </View>

      <AuthButton
        title='Create Account'
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={!isValid}
        disabledReason={getDisabledReason()}
      />

      <Text className='text-xs text-gray-500 text-center mb-4 leading-4'>
        By creating an account, you agree to our{' '}
        <Text className='text-primary'>Terms and Conditions</Text>
      </Text>

      <View className='flex-row justify-center'>
        <Text className='text-gray-600'>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className='text-primary font-bold'>Sign In</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
