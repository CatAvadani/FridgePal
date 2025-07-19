import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  LoginFormData,
  loginSchema,
  mapSupabaseError,
} from '@/utils/authValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const watchedFields = watch();

  const getDisabledReason = (): string | undefined => {
    if (!isDirty) return 'Please enter your login credentials';

    const emailEmpty = !watchedFields.email?.trim();
    const passwordEmpty = !watchedFields.password?.trim();
    const emailInvalid = watchedFields.email && errors.email;

    if (emailEmpty && passwordEmpty) {
      return 'Please enter your email and password';
    } else if (emailEmpty) {
      return 'Please enter your email address';
    } else if (passwordEmpty) {
      return 'Please enter your password';
    } else if (emailInvalid) {
      return 'Please enter a valid email address';
    }

    return undefined;
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);

      if (result.success) {
        router.replace('/(tabs)/home');
      } else {
        const errorMessage = mapSupabaseError(result.error);
        Alert.alert('Sign In Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
      >
        <View className='flex-1 justify-center'>
          <AuthHeader
            title='Welcome back!'
            customImage={require('@/assets/images/splash-icon.png')}
            imageSize={90}
          />

          <View className='mb-6'>
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

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <AuthInput
                  label='Password'
                  placeholder='Enter your password'
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
              )}
            />
          </View>

          <AuthButton
            title='Sign In'
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isValid}
            disabledReason={getDisabledReason()}
          />

          <TouchableOpacity className='mb-8'>
            <Text className='text-primary text-center font-medium'>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className='flex-row justify-center'>
            <Text className='text-gray-600'>Don&#39;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className='text-primary font-bold'>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
