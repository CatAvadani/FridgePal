import AuthButton from '@/components/auth/AuthButton';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthInput from '@/components/auth/AuthInput';
import AuthLayout from '@/components/auth/AuthLayout';
import CustomAlert from '@/components/CustomAlert';
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
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<any[]>([]);

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

  const showAlert = (
    title: string,
    message: string,
    buttons: any[] = [{ text: 'OK' }]
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setAlertVisible(true);
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
        showAlert('Sign In Failed', errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const emailValue = watchedFields.email?.trim();

    if (!emailValue) {
      showAlert(
        'Email Required',
        'Please enter your email address first, then tap "Forgot Password".'
      );
      return;
    }

    showAlert(
      'Reset Password',
      `We'll send a password reset link to ${emailValue}. Check your email and follow the instructions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Link',
          onPress: async () => {
            setIsLoading(true);
            const result = await resetPassword(emailValue);
            setIsLoading(false);

            if (result.success) {
              showAlert(
                'Reset Link Sent',
                'Check your email for the password reset link.'
              );
            } else {
              showAlert('Error', result.error || 'Failed to send reset link.');
            }
          },
        },
      ]
    );
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

          <TouchableOpacity
            className='mb-8'
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text
              className={`text-center font-medium ${
                isLoading ? 'text-gray-400' : 'text-primary'
              }`}
            >
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

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onDismiss={() => setAlertVisible(false)}
      />
    </AuthLayout>
  );
}
