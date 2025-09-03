import AuthLoadingScreen from '@/components/AuthLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  console.log(
    'Welcome screen - User:',
    user?.email || 'none',
    'Loading:',
    isLoading
  );

  // Handle navigation in useEffect to avoid React warnings
  useEffect(() => {
    if (!isLoading && user) {
      console.log('User already authenticated, redirecting to home');
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading, router]);

  // Show loading screen while checking auth state or if redirecting
  if (isLoading || user) {
    return <AuthLoadingScreen />;
  }

  // User is not authenticated, show welcome screen
  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-slate-900'>
      <View className='flex-1 justify-center items-center px-8'>
        <View className='items-center mb-16'>
          <View className='w-72 h-72 rounded-full overflow-hidden mb-8 shadow-lg'>
            <Image
              source={require('@/assets/images/welcome_img.png')}
              className='w-full h-full'
              resizeMode='cover'
            />
          </View>

          <Text className='text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
            FridgePal
          </Text>

          <Text className='text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2'>
            Your Smart Fridge Companion
          </Text>

          <Text className='text-base text-gray-600 dark:text-gray-400 text-center leading-6'>
            Scan and track your groceries effortlessly
          </Text>
        </View>

        <TouchableOpacity
          className='w-full py-4 rounded-xl shadow-md bg-primary'
          onPress={handleGetStarted}
        >
          <Text className='text-white text-center font-semibold text-lg'>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
