import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Add offset for Android
      >
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40, // Extra bottom padding for keyboard
          }}
          keyboardShouldPersistTaps='handled'
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'} // iOS auto-adjust
          keyboardDismissMode='on-drag' // Dismiss keyboard when scrolling
        >
          <View className='flex-1 px-6 pt-8'>
            {/* Flexible top spacing */}
            <View className='flex-1 justify-center min-h-0'>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
